import { AgentRequest } from "./user.interface";
import { Types } from "mongoose";
import { boolean } from "zod";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
export interface AgentRequest {
  isInitiatedByUser?: boolean;
  isInitiatedByAdmin?: boolean;
  isCompleted?: boolean;
}
export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role?: Role;
  phone?: string | null;
  profilePicture?: string | null;
  address?: string | null;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  auths: IAuthProvider[];
  agentRequest?: AgentRequest;
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
