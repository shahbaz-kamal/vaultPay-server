/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

import { TErrorSources } from "../interfaces/error.types";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";

export const globalErrorHandler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("From error===>", error);
  }
  let statusCode = 500;
  let message = `Something went Wrong!!`;
  let errorSource: TErrorSources[] = [];
  //duplicate error
  if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  //cast error
  else if (error.name === "castError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  //zod error
  else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSource as TErrorSources[];
  }
  //mongoose validateionError
  else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources as TErrorSources[];
    statusCode = simplifiedError.statusCode;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    error: envVars.NODE_ENV === "development" ? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
