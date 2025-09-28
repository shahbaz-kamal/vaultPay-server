/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IAuthProvider, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptJs";
import { Wallet } from "../modules/wallet/wallet.model";

export const seedSuperAdmin = async () => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("Super admin exist");
      return;
    }
    console.log("Trying to create super admin");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };
    const payload = {
      name: "super-admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };
    const userDoc = new User(payload);
    const superAdmin = await userDoc.save({ session });
    const superWallet = await Wallet.create([{ user: superAdmin._id }], {
      session,
    });

    superAdmin.wallet = superWallet[0]._id;
    await superAdmin.save({ session });

    console.log(`SuperAdmin Created successfully with data \n
      super Admin: ${superAdmin} \n
      super wallet: ${superWallet}`);
    await session.commitTransaction();
    session.endSession();
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(401, `Error in creating super admin :${error.message}`);
  }
};
