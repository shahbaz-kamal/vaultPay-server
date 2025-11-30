import AppError from "../../errorHelpers/AppError";
import { ICLientMessage } from "./clientMessage.interface";
import { ClientMessage } from "./clientMessage.model";

const storeClientMessage = async (payload: Partial<ICLientMessage>) => {
  const res = await ClientMessage.create(payload);
  return res;
};
const getClientMessage = async () => {
  const clientMessages = await ClientMessage.find();
  return clientMessages;
};

const updateClientMessage = async (id: string) => {
    console.log(id)
  const isExist = await ClientMessage.findOne({ _id: id });
  if (!isExist) throw new AppError(401, "Client Message not found");
  isExist.isRead = true;
  isExist.save();
};
export const CLientMessageService = { storeClientMessage, getClientMessage, updateClientMessage };
