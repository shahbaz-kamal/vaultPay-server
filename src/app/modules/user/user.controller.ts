import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";

const createUser = async (req: Request, res: Response,next:NextFunction) => {
  try {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const user = await UserServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "user created successfully",
      data: user,
    });
  } catch (error: any) {
    // console.log(error);
    // res.status(httpStatus.BAD_REQUEST).json({
    //   message: "Something went wrong",
    //   error,
    // });
    next(error)
  }
};

export const UserControllers = { createUser };
