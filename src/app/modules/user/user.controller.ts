import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: user,
    });
  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const result = await UserServices.getAllUser();

    sendResponse(res, {
      success: true,
      message: "All user data retrieved successfully",
      statusCode: statusCode.OK,
      data: result.data,
      meta: result?.meta,
    });
  }
);

const updateUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token=req.headers.authorization
    // const verifiedToken=verifyToken(token as string,envVars.JWT_SECRET ) as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user Updated successfully",
      data: user,
    });
  }
);

export const UserControllers = { createUser, getAllUser,updateUser };
