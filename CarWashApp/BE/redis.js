import { createClient } from "redis";

export const client = createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => {
  console.error("ERROR connected to redis client");
});

async function connectRedis() {
  try {
    await client.connect();

    console.log("connected to redis");
  } catch (err) {
    console.error("ERROR connecting to redis client");
  }
}

await connectRedis();

