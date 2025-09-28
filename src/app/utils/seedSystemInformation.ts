import AppError from "../errorHelpers/AppError";
import { System } from "../modules/system/system.model";
import { TRANSACTION_TYPE } from "../modules/transaction/transaction.interface";

export const seedSystemInformation = async () => {
  try {
    const isSystemInformationExist = await System.findOne({});
    if (isSystemInformationExist) {
      console.log("System information exist");
      return;
    }
    console.log("Trying to create super admin");

    const payload = {
      balance: 0,
      systemCharges: [
        {
          type: TRANSACTION_TYPE.CASH_IN,
          charge: 0,
          perAmountTransaction: 1000,
        },
        {
          type: TRANSACTION_TYPE.CASH_OUT,
          charge: 20,
          agentCommission: 14,
          perAmountTransaction: 1000,
        },
        {
          type: TRANSACTION_TYPE.SEND_MONEY,
          charge: 5,
        },
      ],
    };

    const systemData = await new System(payload).save();

    // const userDoc = new User(payload);
    // const superAdmin = await userDoc.save({ session });
    // const superWallet = await Wallet.create([{ user: superAdmin._id }], {
    //   session,
    // });

    console.log(`SystemData Created successfully with data \n
     ${systemData}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);

    throw new AppError(401, `Error in creating super admin :${error.message}`);
  }
};
