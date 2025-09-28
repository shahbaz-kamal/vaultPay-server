import z from "zod";

export const sendMoneyZodSchema = z.object({
  // transactionId:z.string("TransactionId is required"),
  // type:z.enum(Object.values(TRANSACTION_TYPE.SEND_MONEY),"Transaction Type is required").optional(),
  // source:z.enum(Object.values(TRANSACTION_SOURCE.USER),"Transaction Type is required").optional(),
  senderEmail: z.email("Sender Must be Email").optional(),
  receiverEmail: z.email(" Reciever must be Email"),
  amount: z.number("Amount must be number"),
  notes: z.string("Notes must be string"),
});
