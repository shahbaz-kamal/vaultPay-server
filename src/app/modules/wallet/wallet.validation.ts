import z from "zod";
import { IsActive } from "../user/user.interface";

export const updateWalletZodSchema = z.object({
  isActive: z.enum(Object.values(IsActive) as [string]),
});
