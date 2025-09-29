import { WalletServices } from "./wallet.service";

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from 'http-status-codes'

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
const updateWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;
    const verifiedToken = req.user as JwtPayload;
    const payload = req.body;
    const wallet = await WalletServices.updateWallet(
      walletId,
      payload,
      verifiedToken
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user Updated successfully",
      data: wallet,
    });
  }
);

export const WalletController = { getAllWallet, updateWallet };
