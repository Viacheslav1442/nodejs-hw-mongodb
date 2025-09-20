import express from "express";
import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import contactsRouter from "./routers/contacts.js";

const app = express();

app.use(express.json());

// маршрути
app.use("/api/contacts", contactsRouter);

// якщо маршрут не знайдено
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

// глобальний обробник помилок
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await initMongoConnection();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
