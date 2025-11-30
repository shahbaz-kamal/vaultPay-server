/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { NewsLetterService } from "./newsLetter.service";

const storeNewsLetterSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  console.log(payload);

  const response = await NewsLetterService.storeNewsLetterSubscription(payload);
  console.log(response);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "You have successfully Subscribed to our newsletter",
    data: null,
  });
});
const getNewsLetter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newsLetter = await NewsLetterService.getNewsLetter();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "You have successfully Retrived  newsletter data",
    data: newsLetter,
  });
});

export const NewsLetterController = { storeNewsLetterSubscription, getNewsLetter };
