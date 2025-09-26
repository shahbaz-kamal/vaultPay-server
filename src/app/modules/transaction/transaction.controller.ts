import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

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
export const TransactionController = { addMoney };
