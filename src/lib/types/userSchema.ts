import { createSelectSchema } from "drizzle-zod";
import { TB_user } from "../schema";
import { z } from "zod";
import { BaseZodError } from "./errorUtilities";

export const userSchema = createSelectSchema(TB_user, {
	username: (schema) =>
		schema.username
			.min(6)
			.max(24),
	password: (schema) => schema.password.min(8).max(32),
});

export const loginSchema = createSelectSchema(TB_user).pick({
	username: true,
	password: true,
});

export const userViewSchema = userSchema.pick({
	id: true,
    username: true,
});



export type UserView = z.infer<typeof userViewSchema>;

export type User = z.infer<typeof userSchema>;

export type LoginFormError = BaseZodError<typeof loginSchema>;
