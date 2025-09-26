import { model, Schema } from "mongoose";
import {
  AgentRequestStatus,
  IAuthProvider,
  IsActive,
  IUser,
  Role,
} from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      required: true,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String, default: null },
    profilePicture: { type: String, default: null },
    address: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: true },
    auths: { type: [authProviderSchema], required: true },
    agentRequestStatus: {
      type: String,
      enum: Object.values(AgentRequestStatus),
      default: AgentRequestStatus.NONE,
    },
    agentRequestedAt: { type: Date, default: null },
    agentApprovedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
