import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS;
const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH;

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createHttpError(409, "Email in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword });

        res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) throw createHttpError(401, "Email or password is wrong");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw createHttpError(401, "Email or password is wrong");

        const payload = { id: user._id };
        const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

        const session = await Session.create({ userId: user._id, refreshToken });

        // кладемо токени в cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("sessionId", session._id.toString(), {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            accessToken,
            user: { email: user.email },
        });
    } catch (err) {
        next(err);
    }
};

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
