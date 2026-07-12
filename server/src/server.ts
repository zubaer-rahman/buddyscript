import app from "./app";
import "dotenv/config";
import config from "./config";
import prisma from "./lib/prisma";

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}, url: ${config.app_url}`);
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
  await prisma.$disconnect();
  process.exit(0);
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught exception:", err);
  await prisma.$disconnect();
  process.exit(1);
});
