import { z } from "zod";

export const registerUserSchema = z
  .object({
    firstName: z.string().min(1, "First name cannot be empty"),
    lastName: z.string().optional(),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    role: z.enum(["USER", "SELLER", "ADMIN"]).optional(),
    phoneNumber: z
      .string()
      .min(6, "Phone number must be at least 6 digits")
      .max(12),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z.email(),
    password: z.string(),
  })
  .strict();

export type registerUserDTO = z.infer<typeof registerUserSchema>;
export type loginUserDTO = z.infer<typeof loginUserSchema>;
