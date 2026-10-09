import { createServer } from "http";
import { app } from "./app.js";
import { initializeSocket } from "./sockets/index.js";
import { initializeJobs } from "./jobs/index.js";

const port = Number(process.env.PORT) || 5173;

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

await initializeJobs();
export const io = initializeSocket(server, process.env.CLIENT_ORIGIN);
