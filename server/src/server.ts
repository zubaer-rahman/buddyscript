import app from "./app.js";
import "dotenv/config";
import config from "./config/index.js";
import prisma from "./lib/prisma.js";
import redis from "./lib/redis.js";

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    // Establish the Redis connection eagerly (lazyConnect is on, so it won't
    // auto-connect — we call connect() manually to surface errors at startup).
    if (redis) {
      await redis.connect().catch((err) => {
        console.warn("Redis unavailable at startup, feed caching disabled:", err.message);
      });
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}, url: ${`http://localhost:${PORT}`}`);
    }); 
  } catch (error) {
    console.error(`Error starting the server: ${error}`);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await Promise.all([prisma.$disconnect(), redis?.quit()]);
  process.exit(0);
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught exception:", err);
  await Promise.all([prisma.$disconnect(), redis?.quit()]);
  process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
  console.error("Unhandled rejection:", reason);
  await Promise.all([prisma.$disconnect(), redis?.quit()]);
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  await Promise.all([prisma.$disconnect(), redis?.quit()]);
  process.exit(0);
});
