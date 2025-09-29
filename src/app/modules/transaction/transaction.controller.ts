import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TransactionService } from "./transaction.service";
import { envVars } from "../../config/env";

const addMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.addMoney(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Add Money Successfull",
      data: result,
    });
  }
);
const addMoneySuccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query=req.query
    const result = await TransactionService.addMoneySuccess(query as Record<string,string>);
    if(result?.success){
      res.redirect(envVars.SSL.SUCCESS_FRONTEND_URL)
    }
    // sendResponse(res, {
    //   statusCode: httpStatus.CREATED,
    //   success: true,
    //   message: "Add Money Successfull",
    //   data: result,
    // });
  }
);
const addMoneyFail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.addMoney(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Add Money Successfull",
      data: result,
    });
  }
);
const addMoneyCancel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.addMoney(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Add Money Successfull",
      data: result,
    });
  }
);

const sendMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sendMoney = await TransactionService.sendMoney(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Send Money Successfull",
      data: sendMoney,
    });
  }
);
const cashOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cashOut = await TransactionService.cashOut(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Cash out Successfull",
      data: cashOut,
    });
  }
);
const cashIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cashIn = await TransactionService.cashIn(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Cash out Successfull",
      data: cashIn,
    });
  }
);
export const TransactionController = {
  addMoney,
  addMoneySuccess,
  addMoneyFail,
  addMoneyCancel,
  sendMoney,
  cashOut,
  cashIn,
};
