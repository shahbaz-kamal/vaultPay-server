import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TransactionService } from "./transaction.service";

const addMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Add Money Successfull",
      data: null,
    });
  }
);

const sendMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sendMoney = await TransactionService.sendMoney(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Add Money Successfull",
      data: sendMoney,
    });
  }
);
export const TransactionController = { addMoney ,sendMoney};
