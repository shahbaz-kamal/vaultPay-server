import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const getUserStatsForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userStats = await StatsService.getUserStatsForAdmin();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived User Data Successfully",
    data: userStats,
  });
});
const getTransactionStatsForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const transactionStats = await StatsService.getTransactionStatsForAdmin();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived Transaction Data Successfully",
    data: transactionStats,
  });
});

// agesnts


// users
const getTransactionStatsForUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;
const userId=decodedToken.userId
  const transactionStats = await StatsService.getTransactionStatsForUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived Transaction Data For USer Successfully",
    data: transactionStats,
  });
});

export const StatsController = { getUserStatsForAdmin,getTransactionStatsForAdmin,getTransactionStatsForUser };
