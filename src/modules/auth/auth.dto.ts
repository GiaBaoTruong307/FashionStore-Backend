import { z } from "zod";

// DTOs for user registration
export const RegisterDTO = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type RegisterType = z.infer<typeof RegisterDTO>;

// DTOs for user login
export const LoginDTO = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginType = z.infer<typeof LoginDTO>;
