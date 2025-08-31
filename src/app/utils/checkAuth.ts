import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import { envVars } from "../config/env";

export const checkAuth =
   (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization as string;
    if (!accessToken)
      throw new AppError(httpStatus.FORBIDDEN, "No token received");

    const verifiedToken = jwt.verify(
      accessToken,
      envVars.JWT_ACCESS_TOKEN_SECRET
    );
    console.log("from verified Token", verifiedToken);
    next();
  };
