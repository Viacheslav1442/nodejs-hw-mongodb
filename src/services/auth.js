import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS;
const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH;

export const register = async ({ email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createHttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        email,
        password: hashedPassword,
    });

    return {
        id: newUser._id,
        email: newUser.email,
    };
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Email or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createHttpError(401, "Email or password is wrong");
    }

    const payload = { id: user._id };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

    return {
        accessToken,
        refreshToken,
        user: { email: user.email },
    };
};

// Новий метод refresh
export const refresh = async (cookies) => {
    const refreshToken = cookies?.refreshToken;
    if (!refreshToken) {
        throw createHttpError(401, "No refresh token provided");
    }

    let payload;
    try {
        payload = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
        throw createHttpError(401, "Invalid refresh token");
    }

    const user = await User.findById(payload.id);
    if (!user) {
        throw createHttpError(401, "User not found");
    }

    const newAccessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: "15m" });

    return { accessToken: newAccessToken };
};


export const logout = async () => {

    return true;
};
