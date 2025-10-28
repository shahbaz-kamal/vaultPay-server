import mongoose from "mongoose";
import { app } from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { seedSystemInformation } from "./app/utils/seedSystemInformation";
import { connectRedis } from "./app/config/redis.config";

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("🍃 Connected to mongoose");

   app.listen(envVars.PORT, () => {
      console.log(`🔐 Vault pay is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log("Error connecting mongoose", error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
  await seedSystemInformation();
  connectRedis()
})();
