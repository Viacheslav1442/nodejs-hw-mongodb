import express from "express";
import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import contactsRouter from "./routers/contacts.js";
import { HttpError } from "./utils/HttpError.js";

const app = express();

app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
    next(HttpError(404, "Not found"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await initMongoConnection();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
