/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { AgentRequest, IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptJs from "bcryptJs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  // if (isUserExist) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  // }
  const hashedPassword = await bcryptJs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUser = async () => {
  const user = await User.find({});
  const totalUser = await User.countDocuments();
  return { data: user, meta: { totalUser } };
};
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT)
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN)
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
      if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
      }
    }
  }
  if (payload.password) {
    payload.password = await bcryptJs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
    // if (payload.agentRequest) {
    //   if (
    //     decodedToken.Role === Role.USER &&
    //     decodedToken.email !== isUserExist.email
    //   )
    //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    //   if (
    //     decodedToken.Role === Role.USER &&
    //     (payload.agentRequest.isCompleted ||
    //       payload.agentRequest.isInitiatedByAdmin)
    //   ) {
    //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    //   }
    //   payload = {
    //     ...payload,
    //     "agentRequest.isInitiatedByUser":
    //       payload.agentRequest.isInitiatedByUser,
    //   } as Partial<IUser>;

    //   delete payload.agentRequest;
    // }
  }
  if (payload.agentRequest) {
    if (decodedToken.role === Role.USER) {
      if (
        payload.agentRequest.isCompleted !== undefined ||
        payload.agentRequest.isInitiatedByAdmin !== undefined
      ) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
      }

      // ✅ Allow only isInitiatedByUser update
      payload = {
        ...(payload as any), // loosen type
        "agentRequest.isInitiatedByUser":
          payload.agentRequest.isInitiatedByUser,
      } as any;

      delete (payload as any).agentRequest;
    }
    if (
      decodedToken.role === Role.ADMIN ||
      decodedToken.role === Role.SUPER_ADMIN
    ) {
      // ✅ Allow only isInitiatedByUser update
      payload = {
        ...(payload as any), // loosen type
        "agentRequest.isInitiatedByAdmin":
          payload.agentRequest?.isInitiatedByAdmin,
        "agentRequest.isCompleted": payload.agentRequest?.isCompleted,
      } as any;

      delete (payload as any).agentRequest;
    }
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdatedUser;
};

export const UserServices = { createUser, getAllUser, updateUser };
