import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import express from "express";
import cors from "cors";
import pino from "pino-http";
import cookieParser from "cookie-parser";
import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { authenticate } from "./middlewares/authenticate.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const startServer = async () => {
    await initMongoConnection();

    const app = express();

    // Дозволяємо фронтенду надсилати запити з cookies
    app.use(
        cors({
            origin: process.env.APP_DOMAIN || "http://localhost:3000",
            credentials: true,
        })
    );

    app.use(pino());
    app.use(express.json());
    app.use(cookieParser());

    // Роути
    app.use("/auth", authRouter);
    app.use("/contacts", authenticate, contactsRouter);

    // 404 handler
    app.use((req, res) =>
        res.status(404).json({ status: 404, message: "Not found" })
    );

    // Глобальний обробник помилок
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
        console.log(`🚀 Server running on port ${PORT}`)
    );
};

startServer();
