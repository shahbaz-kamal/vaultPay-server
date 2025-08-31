import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bryptJs from "bcryptjs";
import { createUserTokens } from "../../utils/userToken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User having email:${email}, does not exist`
    );
  const isPasswordMatched = await bryptJs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatched)
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");

  const userTokens = await createUserTokens(isUserExist);

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
  };
};



export const AuthServices = { credentialsLogin };
