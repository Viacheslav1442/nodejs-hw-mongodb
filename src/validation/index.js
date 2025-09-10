import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./validation/server.js";

const startApp = async () => {
    await initMongoConnection();
    setupServer();
};

startApp();
