import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS;

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw createHttpError(401, "Not authorized");

        const [bearer, token] = authHeader.split(" ");
        if (bearer !== "Bearer" || !token) {
            throw createHttpError(401, "Not authorized");
        }


        const decoded = jwt.verify(token, ACCESS_SECRET);


        const session = await Session.findOne({ userId: decoded.id, accessToken: token });
        if (!session) {
            throw createHttpError(401, "Session expired or invalid");
        }


        const user = await User.findById(decoded.id);
        if (!user) throw createHttpError(401, "Not authorized");

        req.user = user;
        req.session = session;
        next();
    } catch (err) {
        next(createHttpError(401, "Not authorized"));
    }
};
