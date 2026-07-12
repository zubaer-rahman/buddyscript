import { z } from "zod";

const registerValidationSchema = z.object({
  firstName: z.string({ error: "First name is required" }).min(2).max(50),
  lastName: z.string({ error: "Last name is required" }).min(2).max(50),
  email: z.email({ error: "Invalid email format" }),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

const loginValidationSchema = z.object({
  email: z.email({ error: "Invalid email format" }),
  password: z.string({ error: "Password is required" }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};
