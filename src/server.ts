/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response } from "express";
import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("🍃 Connected to mongoose");

    server = app.listen(envVars.PORT, () => {
      console.log(`🔐 Vault pay is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log("Error connecting mongoose", error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin()
})();
