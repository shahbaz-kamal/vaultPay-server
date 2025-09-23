/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import {
  AgentRequestStatus,
  IAuthProvider,
  IUser,
  Role,
} from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptJs from "bcryptJs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
  const session = await User.startSession();
  session.startTransaction();
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }
  const hashedPassword = await bcryptJs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create(
    [
      {
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest,
      },
    ],
    { session }
  );
  const wallet = await Wallet.create(
    [
      {
        user: user[0]._id,
      },
    ],
    { session }
  );
  await session.commitTransaction();
  session.endSession();
  return { user, wallet };
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
  }
  // check if the user is updating their own profile
  const isSelfUpdate = decodedToken.userId === userId;
  const requesterRole = decodedToken.role;

  if (payload.agentRequestStatus) {
    if (
      payload.agentRequestStatus !== AgentRequestStatus.PENDING &&
      isSelfUpdate &&
      requesterRole === Role.USER
    )
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.agentApprovedAt && requesterRole === Role.USER)
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdatedUser;
};

export const UserServices = { createUser, getAllUser, updateUser };
