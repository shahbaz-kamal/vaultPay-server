import AppError from "../../errorHelpers/AppError";

import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs  from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IAuthProvider } from "../user/user.interface";


const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return { accessToken: newAccessToken };
};

export const resetPassword = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  oldPassword: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  newPassword: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  decodedToken: JwtPayload
) => {
  return {};
};
export const setPassword = async (
  userId: string,
password:string
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(401, "User does not exist");

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set password. Now you can change password from your profile"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };
  const auths: IAuthProvider[] = [...user.auths, credentialProvider];
  user.password = hashedPassword;
  user.auths = auths;
  await user.save();
};
export const changePassword = async (
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
  getNewAccessToken,
  resetPassword,
  changePassword,setPassword
};
