import express from "express";
import cors from "cors";
import pino from "pino-http";

import { getContactsController, getContactByIdController } from "./controllers/contacts.js";

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino());

    // Роути
    app.get("/contacts", getContactsController);
    app.get("/contacts/:contactId", getContactByIdController);

    // Обробка неіснуючих маршрутів
    app.use((req, res) => {
        res.status(404).json({ message: "Not found" });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
