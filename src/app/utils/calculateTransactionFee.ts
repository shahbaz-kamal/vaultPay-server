import { System } from "../modules/system/system.model";
import { TRANSACTION_TYPE } from "../modules/transaction/transaction.interface";

export const calculateSendMoney = async () => {
  const system = await System.find();
  const sendMoneyData = system[0].systemCharges.filter(
    (singleType) => singleType.type === TRANSACTION_TYPE.SEND_MONEY
  );
  const sendMoneyCharge = sendMoneyData[0].charge;
  console.log(sendMoneyCharge, "send money charge");
  return sendMoneyCharge;
};
