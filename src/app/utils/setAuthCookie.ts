import { Response } from "express";
import { envVars } from "../config/env";

export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
}

export const setAuthCookie = async (res: Response, tokenInfo: TokenInfo) => {
  if (tokenInfo.accessToken)
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });

  if (tokenInfo.refreshToken)
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
};
