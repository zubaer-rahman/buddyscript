import { z } from "zod";

const registerValidationSchema = z.object({
  firstName: z.string({ error: "First name is required" }).min(2).max(50),
  lastName: z.string({ error: "Last name is required" }).min(2).max(50),
  email: z.email({ error: "Invalid email format" }),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a digit"),
});

const loginValidationSchema = z.object({
  email: z.email({ error: "Invalid email format" }),
  password: z.string({ error: "Password is required" }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};
