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
export const calculateCashOutCharge = async (amount: number) => {
  const system = await System.find();
  const cashOutData = system[0].systemCharges.filter(
    (singleType) => singleType.type === TRANSACTION_TYPE.CASH_OUT
  );
  const informationObject = cashOutData[0];
  const sendMoneyCharge =
    (informationObject.charge /
      Number(informationObject.perAmountTransaction)) *
    amount;
  const agentCommission =
    (Number(informationObject.agentCommission) /
      Number(informationObject.perAmountTransaction)) *
    amount;

  const systemProfit = sendMoneyCharge - agentCommission;
  console.log(sendMoneyCharge, "send money charge");
  return { sendMoneyCharge, agentCommission, systemProfit };
};
export const calculateCashInCharge = async () => {
  const system = await System.find();
  const cashInData = system[0].systemCharges.filter(
    (singleType) => singleType.type === TRANSACTION_TYPE.CASH_IN
  );
  const informationObject = cashInData[0];
  const cashInCharge = informationObject.charge;

  return cashInCharge;
};
