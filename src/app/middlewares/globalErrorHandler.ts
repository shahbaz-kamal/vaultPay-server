/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("From error===>", error);
  let statusCode = 500;
  let message = `Something went Wrong!!`;
  const errorSource: any = [];
  //duplicate error
  if (error.code === 11000) {
    statusCode = 400;
    const matchedArray = error.message.match(/"([^"]*)"/);
    message = `${matchedArray[0]} already exists`;
  }
  //cast error
  else if (error.name === "castError") {
    statusCode = 400;
    message = "Validation Error";
  }
  //validateionError
  else if (error.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(error.errors);

    errors.forEach((errorObject: any) =>
      errorSource.push({ path: errorObject.path, message: errorObject.message })
    );
    console.log("the Array\n", errorSource);
    message = error.message;
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
    // error,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
