import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization as string;
    if (!accessToken) throw new AppError(httpStatus.FORBIDDEN, "No token received");

    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
    
    console.log("from verified Token", verifiedToken);
    const isUserExist = await User.findOne({
      email: verifiedToken.email,
    });

    if (!isUserExist) throw new AppError(httpStatus.BAD_REQUEST, "User dosent exist");

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE)
      throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);

    if (isUserExist.isDeleted) throw new AppError(httpStatus.BAD_REQUEST, `User is deleted`);

    if (!isUserExist.isVerified) throw new AppError(httpStatus.BAD_REQUEST, `User is Not Verified`);

    if (!authRoles.includes(verifiedToken.role)) throw new AppError(403, "you are not permitted to view this route");

    req.user = verifiedToken;
    // console.log("from verified Token", verifiedToken);
    next();
  };
