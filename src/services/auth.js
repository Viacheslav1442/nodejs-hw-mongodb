import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS;
const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH;

export const register = async ({ name, email, password }) => {
    const existing = await User.findOne({ email });
    if (existing) throw createHttpError(409, "Email in use");

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const { password: _, ...safeUser } = user.toObject();
    return safeUser;
};

export const login = async ({ email, password }, res) => {
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, "Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createHttpError(401, "Invalid email or password");

    await Session.deleteMany({ userId: user._id });

    const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "30d" });

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
};

export const refresh = async (cookies, res) => {
    const { refreshToken } = cookies;
    if (!refreshToken) throw createHttpError(401, "No refresh token");

    let payload;
    try {
        payload = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch {
        throw createHttpError(401, "Invalid refresh token");
    }

    await Session.deleteMany({ userId: payload.id });

    const accessToken = jwt.sign({ id: payload.id }, ACCESS_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ id: payload.id }, REFRESH_SECRET, { expiresIn: "30d" });

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await Session.create({
        userId: payload.id,
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true });

    return { accessToken };
};

export const logout = async (cookies) => {
    const { refreshToken } = cookies;
    if (!refreshToken) return;
    await Session.deleteOne({ refreshToken });
};
