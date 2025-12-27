import mongoose from "mongoose";
import { HttpError } from "../utils/HttpError.js";

export const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    if (!mongoose.isValidObjectId(contactId)) {
        return next(HttpError(400, "Invalid id format"));
    }
    next();
};