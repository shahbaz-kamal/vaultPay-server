/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const { user } = await UserServices.createUser(req.body);
    const message = "User and wallet created successfully";

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message,
      data: user,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const userId = req.params.id;
    const result = await UserServices.getSingleUser(userId);

    sendResponse(res, {
      success: true,
      message: "single user data retrieved successfully",
      statusCode: statusCode.OK,
      data: result.data,
    });
  }
);
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const query = req.query;
    const result = await UserServices.getAllUser(
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      message: "user data retrieved successfully",
      statusCode: statusCode.OK,
      data: result.data,
      meta: result?.meta,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user as JwtPayload;
    const payload:Partial<IUser> = {...req.body,profilePicture:req.file?.path};
    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    console.log("From file upload===>", { file: req.file, body: payload });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user Updated successfully",
      data: user,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: " your profile retrieved successfully",
      data: result.data,
    });
  }
);
export const UserControllers = {
  createUser,
  getAllUser,
  updateUser,
  getSingleUser,
  getMe,
};
