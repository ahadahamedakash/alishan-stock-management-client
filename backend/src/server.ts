import { Server } from "http";
import mongoose from "mongoose";

import app from "./app";
import config from "./app/config";
import { initializeSocket } from "./app/socket";

import { seedSuperAdmin } from "./app/modules/user/user.seed";
import { seedBalance } from "./app/modules/balance/balance.seed";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    await seedSuperAdmin();

    await seedBalance();

    // Create HTTP server
    server = app.listen(config.port, () => {
      console.log(`🚀 Server listening on port ${config.port}`);
    });

    // Initialize Socket.IO
    initializeSocket(server);
  } catch (err) {
    console.log(err);
  }
}

main();
