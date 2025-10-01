import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS;

export const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) throw createHttpError(401, "No token provided");

        const [type, token] = header.split(" ");
        if (type !== "Bearer" || !token) throw createHttpError(401, "Invalid token format");

        const payload = jwt.verify(token, ACCESS_SECRET);

        const user = await User.findById(payload.id);
        if (!user) throw createHttpError(401, "User not found");

        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            next(createHttpError(401, "Access token expired"));
        } else {
            next(err);
        }
    }
};
