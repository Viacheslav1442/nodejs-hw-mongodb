import express from "express";
import cors from "cors";
import pino from "pino-http";
import contactsRouter from "./routers/contacts.js";

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());


    app.use("/contacts", contactsRouter);

    // 404 handler для всіх неіснуючих маршрутів
    app.use((req, res) => {
        res.status(404).json({ message: "Not found" });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
