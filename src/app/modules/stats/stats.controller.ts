import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";


const getStatsForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userStats = await StatsService.getStatsForAdmin();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived Required Data For Admin",
    data: userStats,
  });
});
const getStatsForUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const decodedToken=req.user as JwtPayload

  if(!decodedToken) 
    throw new AppError(httpStatus.UNAUTHORIZED,"No token received")
  const userStats = await StatsService.getStatsForUser(decodedToken.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived Required Data For Admin",
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


export const StatsController = { getStatsForAdmin,getTransactionStatsForAdmin,getStatsForUser };
