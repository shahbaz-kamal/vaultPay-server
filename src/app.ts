import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { logger } from "./app/middlewares/logger";
import { router } from "./app/routes";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFoundRoute } from "./app/middlewares/notFoundError";

export const app = express();

//required constatnts for middlewares

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(logger);

// routing middlewares
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("🔐 Vault Pay server is running ");
});

// global error handler

app.use(globalErrorHandler);

// not found route
app.use(notFoundRoute)