import AppError from "../../errorHelpers/AppError";

import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IAuthProvider, IsActive } from "../user/user.interface";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken: newAccessToken };
};

import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

export const setPassword = async (userId: string, password: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(401, "User does not exist");

  if (user.password && user.auths.some((providerObject) => providerObject.provider === "google")) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already set password. Now you can change password from your profile");
  }

  const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));
  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };
  const auths: IAuthProvider[] = [...user.auths, credentialProvider];
  user.password = hashedPassword;
  user.auths = auths;
  await user.save();
};
export const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const isOldPasswordMatched = await bcryptJs.compare(oldPassword, user?.password as string);
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Dosent match");
  }
  user.password = await bcryptJs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
  user.save();
};

export const resetPassword = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.userId)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You can not reset your password"
    );
  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User dosent exist");

  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  isUserExist.password = hashedPassword;
  await isUserExist.save();
};


export const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User dosent exist");
  }
  if (isUserExist.isActive === IsActive.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
  sendEmail({
    to: isUserExist.email,
    subject: "Password reset",
    templateName: "forgotPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};
export const AuthServices = {
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  forgotPassword,
};
