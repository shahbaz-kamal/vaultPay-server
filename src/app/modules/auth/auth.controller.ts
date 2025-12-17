/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

import { setAuthCookie } from "../../utils/setAuthCookie";
import AppError from "../../errorHelpers/AppError";
import { createUserTokens } from "../../utils/userToken";
import { envVars } from "../../config/env";
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // const loginInfo = await AuthServices.credentialsLogin(req.body);
  passport.authenticate("local", async (error: any, user: any, info: any) => {
    if (error) return next(new AppError(httpStatus.BAD_REQUEST || 401, error));

    if (!user) return next(new AppError(httpStatus.BAD_REQUEST || 401, info?.message));

    const userTokens = await createUserTokens(user);
    delete user.toObject().password;
    setAuthCookie(res, userTokens);
    sendResponse(res, {
      success: true,
      message: "User logged in successfully",
      statusCode: httpStatus.CREATED,
      data: {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user,
      },
    });
  })(req, res, next);
});

const getNewAccessToken = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies");
    }
    //   const user = await UserServices.createUser(req.body);
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);
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

const logout = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "logged out",
      data: null,
    });
  }
);

const setPassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const password = req.body.password;

    await AuthServices.setPassword(decodedToken.userId, password);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Password has been set successfully ",
      data: null,
    });
  }
);
const changePassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    await AuthServices.changePassword(oldPassword, newPassword, decodedToken);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Password changed successfully ",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const payload = req.body;
    await AuthServices.resetPassword(payload, decodedToken as JwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: " Reset password successfull",
      data: null,
    });
  }
);
const forgotPassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthServices.forgotPassword(email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Email sent successfully ",
      data: null,
    });
  }
);

const googleCallbackController = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo?.slice(1);
    }
    const user = req.user;
    console.log("Google user", user);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    const tokenInfo = await createUserTokens(user);
    console.log("From google login", tokenInfo);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.CREATED,
    //   message: "Password changed successfully ",
    //   data: null,
    // });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
  changePassword,
  setPassword,
  forgotPassword,
};
