import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

//required constatnts for middlewares

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("🔐 Vault Pay server is running ");
});
