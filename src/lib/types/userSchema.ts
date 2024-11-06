import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { TB_user } from "../schema";
import { BaseZodError } from "./errorUtilities";

export const loginFormSchema = z.object({
	username: z.string().min(8),
	password: z.string().min(8).max(32),
});


export const registerFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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

export const userExcerciseAnswerSchema = z.object({
	time: z.number(), // تحويل إلى Date
	is_show_ans: z.boolean(),
	trials: z.number().int().min(1), // تحويل إلى integer
});
export const userExcerciseAnswerSchemaForInput = z.object({
	query: z.string().min(1),
	is_show_ans: z.boolean(),
});

// export const userExcerciseAnswerSchema = createSelectSchema(TB_user_excercise_summary, {
// 	time: (schema) => schema.time,
// 	trials: (schema) => schema.trials.min(1),
// 	is_show_ans : (schema) => schema.is_show_ans,
// });

export const userCreateTabelSchema = z.object({
	query: z.string().min(1),
});

export type UserView = z.infer<typeof userViewSchema>;
export type User = z.infer<typeof userSchema>;

export type userExcerciseAnswerError = BaseZodError<
	typeof userExcerciseAnswerSchema
>;
