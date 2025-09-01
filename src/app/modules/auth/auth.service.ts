import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptJs from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User having email:${email}, does not exist`
    );
  const isPasswordMatched = await bcryptJs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatched)
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");

  const userTokens = await createUserTokens(isUserExist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rests } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: { ...rests },
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return { accessToken: newAccessToken };
};

export const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const isOldPasswordMatched = await bcryptJs.compare(
    oldPassword,
    user?.password as string
  );
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Dosent match");
  }
  user.password = await bcryptJs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user.save();
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
