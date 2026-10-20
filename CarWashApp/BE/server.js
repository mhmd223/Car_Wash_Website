import { createServer } from "http";
import { initializeJobs } from "./jobs/index.js";
import { dbConnection } from "./sql_utils/DBconnection.js";

let server;
let io;

export function createServerInstance(appInstance) {
  server = createServer(appInstance);
  // io = initializeSocket(server, process.env.CLIENT_ORIGIN);

  return { server, io };
}

const port = Number(process.env.PORT) || 5173;

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
