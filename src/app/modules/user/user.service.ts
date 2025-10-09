/* eslint-disable @typescript-eslint/no-dynamic-delete */
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
import bcryptJs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";
import { searchableFields } from "../../constants";

import { QueryBuilder } from "../../utils/QueryBuilder";

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

  user[0].wallet = wallet[0]._id;
  await user[0].save({ session });
  await session.commitTransaction();
  session.endSession();
  return { user, wallet };
};

//const users =new QueryBuilder(User.find(),query)
const getAllUser = async (query: Record<string, string>) => {
  const modelQuery = new QueryBuilder<IUser>(User.find(), query);
  const users = modelQuery
    .search(searchableFields)
    .filter()
    .sort()
    .fields()
    .pagination();

  const [data, meta] = await Promise.all([users.build(), users.getMeta()]);

  return { data, meta };
};

// const getAllUser = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query?.fields?.split(",").join(" ") || "";
//   const page = Number(query.page) || 1;
//   const limit = Number(query?.limit) || 10;

//   const skip = (page - 1) * limit;
//   for (const field of excludedFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQuery = {
//     $or: searchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   const filterQuery = User.find(filter).find(searchQuery);

//   const user = await filterQuery
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);

//   const totalDocuments = await User.countDocuments();
//   const totalPage = Math.ceil(user.length / limit);

//   const meta: TMeta = {
//     totalDocuments,
//     noOfMatchedDocuments: user.length,
//     page,
//     totalPage,
//     limit,
//   };
//   return { data: user, meta };
// };

const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId);
  return { data: user };
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

if(decodedToken.role===Role.USER ||  decodedToken.role===Role.AGENT){
if (userId!==decodedToken.userId) throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }
  if (payload.password) {
    payload.password = await bcryptJs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    if (isUserExist.auths.length) {
      const isCredentialsExist = isUserExist.auths.find(
        (auth) => auth.provider === "credentials"
      );
      if (!isCredentialsExist) {
        const newAuth: IAuthProvider = {
          provider: "credentials",
          providerId: isUserExist.email,
        };
        isUserExist.auths.push(newAuth);
        await isUserExist.save();
      }
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


  }
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdatedUser;
};

const getMe = async (myId: string) => {
  const user = await User.findById(myId).select("-password");

  return {
    data: user,
  };
};

export const UserServices = {
  createUser,
  getAllUser,
  updateUser,
  getSingleUser,getMe
};
