import * as authService from "../services/auth.js";
import crypto from "crypto";

export const register = async (req, res, next) => {
    try {
        const data = await authService.register(req.body);
        res.status(201).json({
            status: 201,
            message: "Successfully registered a user!",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { accessToken, refreshToken, user } = await authService.login(req.body);


        const sessionId = crypto.randomUUID();


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // sessionId у cookie
        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 200,
            message: "Successfully logged in a user!",
            data: { accessToken, user },
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const data = await authService.refresh(req.cookies);
        res.status(200).json({
            status: 200,
            message: "Token refreshed!",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logout();


        res.clearCookie("refreshToken");
        res.clearCookie("sessionId");

        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
