import { System } from "../modules/system/system.model";
import { TRANSACTION_TYPE } from "../modules/transaction/transaction.interface";

export const calculateSendMoney = async (amount: number) => {
  const system = await System.find();
  const sendMoneyData = system[0].systemCharges.filter(
    (singleType) => singleType.type === TRANSACTION_TYPE.SEND_MONEY
  );

  console.log(sendMoneyData);
};
