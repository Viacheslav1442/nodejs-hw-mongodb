import * as authService from "../services/auth.js";

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
        const { accessToken } = await authService.login(req.body, res);
        res.status(200).json({
            status: 200,
            message: "Successfully logged in an user!",
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const { accessToken } = await authService.refresh(req.cookies, res);
        res.status(200).json({
            status: 200,
            message: "Successfully refreshed a session!",
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logout(req.cookies);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
