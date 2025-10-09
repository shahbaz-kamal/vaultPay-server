import { Response } from "express";
import { envVars } from "../config/env";

export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
}

const isProduction = envVars.NODE_ENV === "production";

export const setAuthCookie = async (res: Response, tokenInfo: TokenInfo) => {
  if (tokenInfo.accessToken)
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

  if (tokenInfo.refreshToken)
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
};
