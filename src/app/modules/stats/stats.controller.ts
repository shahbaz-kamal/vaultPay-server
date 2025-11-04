import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";
import httpStatus from "http-status-codes";

const getUserStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userStats = await StatsService.getUserStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived User Data Successfully",
    data: userStats,
  });
});
const getTransactionStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const transactionStats = await StatsService.getTransactionStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived Transaction Data Successfully",
    data: transactionStats,
  });
});

export const StatsController = { getUserStats,getTransactionStats };
