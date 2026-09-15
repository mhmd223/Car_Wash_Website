import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(testDirectory, "..");
const serverPath = path.join(projectDirectory, "CarWashApp", "BE", "server.js");
const port = 5191;
let serverProcess;

function startServer() {
  return new Promise((resolve, reject) => {
    serverProcess = spawn(process.execPath, [serverPath], {
      cwd: projectDirectory,
      env: {
        ...process.env,
        PORT: String(port),
        SKIP_STARTUP_JOBS: "true",
        NODE_ENV: "test",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";
    const onData = (chunk) => {
      output += chunk.toString();
      if (output.includes(`listening on port ${port}!`)) {
        cleanup();
        resolve();
      }
    };
    const onExit = (code) => {
      cleanup();
      reject(new Error(`Server exited with code ${code}: ${output}`));
    };
    const cleanup = () => {
      serverProcess.stdout.off("data", onData);
      serverProcess.off("exit", onExit);
    };

    serverProcess.stdout.on("data", onData);
    serverProcess.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    serverProcess.on("exit", onExit);
  });
}

test.before(async () => {
  await startServer();
});

test.after(() => {
  serverProcess?.kill();
});

test("reports liveness from the running server", async () => {
  const response = await fetch(`http://localhost:${port}/health/live`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("protects account routes without a session", async () => {
  const response = await fetch(`http://localhost:${port}/account/me`);

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { status: "Unauthorized" });
});
