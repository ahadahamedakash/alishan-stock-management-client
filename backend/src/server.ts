import { Server } from "http";
import mongoose from "mongoose";

import app from "./app";
import config from "./app/config";
import logger from "./app/config/logger";

import { initializeSocket } from "./app/socket";
import { seedSuperAdmin } from "./app/modules/user/user.seed";
import { seedBalance } from "./app/modules/balance/balance.seed";

let server: Server;

async function main() {
  try {
    logger.info("Connecting to MongoDB...", {
      database_url: config.database_url,
    });
    await mongoose.connect(config.database_url as string);
    logger.info("MongoDB connected successfully");

    await seedSuperAdmin();
    logger.info("Super admin seeded successfully");

    await seedBalance();
    logger.info("Balance seeded successfully");

    // Create HTTP server
    server = app.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port}`, {
        port: config.port,
        env: process.env.NODE_ENV || "development",
      });
    });

    // Initialize Socket.IO
    initializeSocket(server);
  } catch (err) {
    logger.error("Failed to start server", { error: err });
    process.exit(1);
  }
}

main();
