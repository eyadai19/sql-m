import { z } from "zod";
import { BaseZodError } from "./errorUtilities";
import { createSelectSchema } from 'drizzle-zod';
import { TB_user } from "../schema";

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




export const userSchema = createSelectSchema(TB_user, {
	username: (schema) => schema.username.min(6).max(24),
	password: (schema) => schema.password.min(8).max(32),
});


export const userViewSchema = userSchema.pick({
	id: true,
	username: true,
});

export type UserView = z.infer<typeof userViewSchema>;

export type User = z.infer<typeof userSchema>;

