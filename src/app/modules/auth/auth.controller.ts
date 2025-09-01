import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

import { setAuthCookie } from "../../utils/setAuthCookie";
import AppError from "../../errorHelpers/AppError";
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);
    sendResponse(res, {
      success: true,
      message: "User logged in successfully",
      statusCode: httpStatus.CREATED,
      data: loginInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token recieved from cookies"
      );
    }
    //   const user = await UserServices.createUser(req.body);
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );
    setAuthCookie(res, tokenInfo);
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "new access Token retrieved successfully",
      data: tokenInfo,
    });
  }
);

export const AuthController = { credentialsLogin, getNewAccessToken };
