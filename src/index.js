import { initMongoConnection } from "./src/db/initMongoConnection.js";
import { setupServer } from "./server.js";

const startApp = async () => {
    await initMongoConnection();
    setupServer();
};

startApp();
