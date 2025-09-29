import { WalletServices } from "./wallet.service";


import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from 'http-status-codes'

const getAllWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const query = req.query;
    const result = await WalletServices.getAllWallet(
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

export const WalletController={getAllWallet}
