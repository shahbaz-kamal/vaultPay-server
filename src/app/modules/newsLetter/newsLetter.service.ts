import AppError from "../../errorHelpers/AppError";
import { INewsLetter } from "./newsLetter.interface";
import { NewsLetter } from "./newsLetter.model";

const storeNewsLetterSubscription = async (payload: INewsLetter) => {
  const isEmailExist = await NewsLetter.findOne({ email: payload.email });
  if (isEmailExist) throw new AppError(400, "You are already subscribed to our newsletter");
  const res = await NewsLetter.create(payload);
  return res;
};
const getNewsLetter = async () => {
 const newsLetter=await NewsLetter.find()
  return newsLetter;
};
export const NewsLetterService = { storeNewsLetterSubscription,getNewsLetter };
