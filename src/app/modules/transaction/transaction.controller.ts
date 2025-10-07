import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TransactionService } from "./transaction.service";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const addMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await TransactionService.addMoney(req.body, decodedToken);
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
    const query = req.query;
    const result = await TransactionService.addMoneySuccess(
      query as Record<string, string>
    );
    if (result?.success) {
      res.redirect(
        `${envVars.SSL.SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
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
    const query = req.query;
    const result = await TransactionService.addMoneyFail(
      query as Record<string, string>
    );
    if (result?.success === false) {
      res.redirect(
        `${envVars.SSL.FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);
const addMoneyCancel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await TransactionService.addMoneyFail(
      query as Record<string, string>
    );
    if (result?.success === false) {
      res.redirect(
        `${envVars.SSL.FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const sendMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const sendMoney = await TransactionService.sendMoney(
      req.body,
      decodedToken
    );

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
    const decodedToken = req.user as JwtPayload;
    const cashOut = await TransactionService.cashOut(req.body, decodedToken);

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
      message: "Cash In Successfull",
      data: cashIn,
    });
  }
);

const getAllTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const query = req.query;
    const result = await TransactionService.getAllTransaction(
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      message: "Transaction data retrieved successfully",
      statusCode: httpStatus.OK,
      data: result.data,
      meta: result?.meta,
    });
  }
);
const getMyTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const query = req.query;

    const result = await TransactionService.getMyTransactions(
      decodedToken,
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your Transaction data has been received",
      data: result.data,
      meta: result?.meta,
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
  getAllTransaction,
  getMyTransactions,
};
