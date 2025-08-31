import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";
import { envVars } from "../config/env";

export const createUserTokens = async (user: Partial<IUser>) => {
  const jwtPayload: JwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_TOKEN_SECRET,
    envVars.JWT_ACCESS_TOKEN_EXPIRES_IN
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_TOKEN_SECRET,
    envVars.JWT_ACCESS_TOKEN_EXPIRES_IN
  );

  return { accessToken, refreshToken };
};
