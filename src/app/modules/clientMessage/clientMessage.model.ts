import { model, Schema } from "mongoose";
import { ICLientMessage } from "./clientMessage.interface";

const clientMessageSchema = new Schema<ICLientMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: null },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const ClientMessage = model<ICLientMessage>("ClienMessage", clientMessageSchema);
