import express from "express";
import cors from "cors";
import pino from "pino-http";
import contactsRouter from "./routers/contacts.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRouter from "./src/routers/auth.js";


export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());
    app.use("/auth", authRouter);

    // Підключення роутера
    app.use("/contacts", contactsRouter);

    // 404 для неіснуючих маршрутів
    app.use((req, res, next) => {
        res.status(404).json({ message: "Not found" });
    });

    // Глобальний обробник помилок
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
