/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CLientMessageService } from "./clientMessage.service";

const storeClientMessage = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const response = await CLientMessageService.storeClientMessage(payload);
  console.log(response);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Message Has been recorded Successfully",
    data: null,
  });
});
const getClientMessage = catchAsync(async (req: Request, res: Response) => {
  const clientMessages = await CLientMessageService.getClientMessage();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "You have successfully Retrived  Client Message data",
    data: clientMessages,
  });
});
const updateClientMessage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await CLientMessageService.updateClientMessage(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "You have successfully Updated The State of client message",
    data: null,
  });
});

export const ClientMessageController = { storeClientMessage, getClientMessage, updateClientMessage };
