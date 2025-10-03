import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import express from "express";
import cors from "cors";
import pino from "pino-http";
import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { authenticate } from "./middlewares/authenticate.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const startServer = async () => {
    await initMongoConnection();

    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());


    app.use("/auth", authRouter);


    app.use("/contacts", authenticate, contactsRouter);

    // 404
    app.use((req, res) => res.status(404).json({ message: "Not found" }));


    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
