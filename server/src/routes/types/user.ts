import z from 'zod';

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    type: z.enum(["user", "admin"]).default("user"),
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string(),
})

declare global {
    namespace Express {
      export interface Request {
        role?: "Admin" | "User";
        userId?: string;
      }
    }
}