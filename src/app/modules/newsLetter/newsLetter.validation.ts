import z from "zod";

export const storeNewsLetterZodSchema = z.object({
  email: z
    .email("Invalid Email Format")
    .min(2, "Email should be at least minimum of two characters")
    .max(50, "Email should be maximum of 50 characters"),
});
