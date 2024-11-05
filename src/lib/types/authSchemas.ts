import { z } from "zod";
import { BaseZodError } from "./errorUtilities";

export const loginFormSchema = z.object({
	username: z.string().min(8),
	password: z.string().min(8).max(32),
});

export const registerFormSchema = z.object({
	username: z.string().min(3).max(16),
	password: z.string().min(8).max(32),
});

export type LoginFormError = BaseZodError<typeof loginFormSchema>;
export type RegisterFormError = BaseZodError<typeof registerFormSchema>;