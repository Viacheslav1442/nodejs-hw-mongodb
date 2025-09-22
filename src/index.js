import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";

const startServer = async () => {
    await initMongoConnection(); // підключення до MongoDB
    setupServer(); // запуск сервера
};

startServer();
