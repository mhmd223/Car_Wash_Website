import { createServer } from "http";
import { initializeSocket } from "./sockets/index.js";
import { initializeJobs } from "./jobs/index.js";
import { dbConnection } from "./sql_utils/DBconnection.js";
import app from "./app.js";

const port = Number(process.env.PORT) || 5173;

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = initializeSocket(server, process.env.CLIENT_ORIGIN);

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down.`);
  server.close(async () => {
    io.close();
    await dbConnection.end();
    process.exit(0);
  });
};
process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

await initializeJobs();
