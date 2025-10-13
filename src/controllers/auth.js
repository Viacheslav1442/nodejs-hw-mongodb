import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { resetPasswordController } from "../controllers/auth.js";
import { resetPasswordSchema } from "../validation/resetPwdValidation.js";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS;
const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined in .env");
}

// ------------------ РЕЄСТРАЦІЯ ------------------
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw createHttpError(400, "Name, email and password are required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createHttpError(409, "Email in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            status: 201,
            message: "Successfully registered a user!",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt,
            },
        });
    } catch (err) {
        if (err.code === 11000) {
            next(createHttpError(409, "Email already exists"));
        } else {
            next(err);
        }
    }
};

// ------------------ ЛОГІН ------------------
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw createHttpError(400, "Email and password are required");
        }

        const user = await User.findOne({ email });
        if (!user) throw createHttpError(401, "Email or password is wrong");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw createHttpError(401, "Email or password is wrong");

        const payload = { id: user._id };
        const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "30d" });

        // видаляємо стару сесію
        await Session.deleteMany({ userId: user._id });

        // створюємо нову
        const session = await Session.create({
            userId: user._id,
            accessToken,
            refreshToken,
            accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
            refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.cookie("sessionId", session._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({
            status: 200,
            message: "Successfully logged in an user!",
            data: { accessToken },
        });
    } catch (err) {
        next(err);
    }
};

// ------------------ REFRESH ------------------
export const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw createHttpError(401, "No refresh token provided");

        let payload;
        try {
            payload = jwt.verify(refreshToken, REFRESH_SECRET);
        } catch {
            throw createHttpError(401, "Invalid refresh token");
        }

        const user = await User.findById(payload.id);
        if (!user) throw createHttpError(401, "User not found");

        // видаляємо попередню сесію
        await Session.deleteMany({ userId: user._id });

        // створюємо нову
        const newAccessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: "15m" });
        const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "30d" });

        const newSession = await Session.create({
            userId: user._id,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
            refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.cookie("sessionId", newSession._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({
            status: 200,
            message: "Successfully refreshed a session!",
            data: { accessToken: newAccessToken },
        });
    } catch (err) {
        next(err);
    }
};

// ------------------ LOGOUT ------------------
export const logout = async (req, res, next) => {
    try {
        const sessionId = req.cookies.sessionId;
        if (sessionId) {
            await Session.findByIdAndDelete(sessionId);
        }
        res.clearCookie("refreshToken");
        res.clearCookie("sessionId");
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};


// ------------------ SEND RESET EMAIL ------------------
export const sendResetEmailController = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) throw createHttpError(400, "Email is required");

        const user = await User.findOne({ email });
        if (!user) throw createHttpError(404, "User not found");

        const token = jwt.sign({ email }, ACCESS_SECRET, { expiresIn: "5m" });
        const link = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

        await sendResetEmail(email, link);

        res.json({
            status: 200,
            message: "Reset password email has been successfully sent.",
            data: {},
        });
    } catch (err) {
        if (err.response) {
            next(createHttpError(500, "Failed to send the email, please try again later."));
        } else {
            next(err);
        }
    }
};

// ------------------ RESET PASSWORD ------------------
export const resetPasswordController = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            throw createHttpError(400, "Token and new password are required");
        }

        let decoded;
        try {
            decoded = jwt.verify(token, ACCESS_SECRET);
        } catch {
            throw createHttpError(401, "Token is expired or invalid");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw createHttpError(404, "User not found");

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        await Session.deleteMany({ userId: user._id });

        res.json({
            status: 200,
            message: "Password has been successfully reset.",
            data: {},
        });
    } catch (err) {
        next(err);
    }
};

