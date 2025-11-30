import z from "zod";

export const clientMessageZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name should be at least minimum of two characters")
    .max(50, "Name should be maximum of 50 characters"),
  email: z
    .email("Invalid Email Format")
    .min(2, "Email should be at least minimum of two characters")
    .max(50, "Email should be maximum of 50 characters"),
  subject: z.string("Subject Must be String").max(300, "Subject can not exceed more than 300 characters").optional(),
  message: z
    .string("Message is required")
    .min(10, "Message should be at least minimum of ten characters")
    .max(2000, "Message can not exceed more than 1000 characters"),
  isRead: z.boolean("isRead Must be true or false.").optional(),
});
