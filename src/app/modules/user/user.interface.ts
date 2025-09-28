import { Types } from "mongoose";

export interface TMeta {
  totalDocuments?: number;
  noOfMatchedDocuments?: number;
  pageNumber?: number;
  totalPage?: number;
  limit?: number;
}

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

export enum AgentRequestStatus {
  NONE = "NONE",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
export interface IUser {
  _id?: Types.ObjectId;
  wallet?: Types.ObjectId;
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
  agentRequestStatus?: AgentRequestStatus;
  agentRequestedAt?: Date | null;
  agentApprovedAt?: Date | null;
}
