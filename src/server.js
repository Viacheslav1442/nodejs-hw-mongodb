import express from "express";
import cors from "cors";
import pino from "pino-http";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { authenticate } from "./middlewares/authenticate.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const setupServer = () => {
    const app = express();

    // Підключення Swagger
    const swaggerPath = path.join(process.cwd(), "docs", "swagger.json");
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Middleware
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
        res.status(404).json({ status: "error", message: "Not found", data: null })
    );

    // Глобальний обробник помилок
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};
