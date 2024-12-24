import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { TB_user } from "../schema";
import { BaseZodError } from "./errorUtilities";

export const userSchema = createSelectSchema(TB_user, {
	username: (schema) => schema.username.min(6).max(24),
	password: (schema) => schema.password.min(8).max(32),
});

export const userViewSchema = userSchema.pick({
	id: true,
	username: true,
});

export const userExcerciseAnswerSchema = z.object({
	time: z.number(),
	is_show_ans: z.boolean(),
	trials: z.number().int(),
});
export const userExcerciseAnswerSchemaForInput = z.object({
	query: z.string().min(1),
	is_show_ans: z.boolean(),
});

export const userCreateTabelSchema = z.object({
	query: z.string().min(1),
});

export const userChatBotInputSchema = z.object({
	question: z.string().min(1),
});

export const userChatBotExpInputSchema = z.object({
	question: z.string().min(1),
	answer: z.string().min(1),
});

export const userQuizAnswerSchema = z.object({
	question: z.array(z.string()),
	answer: z.array(z.string()),
});

export type UserView = z.infer<typeof userViewSchema>;
export type User = z.infer<typeof userSchema>;

export type userExcerciseAnswerError = BaseZodError<
	typeof userExcerciseAnswerSchema
>;

export type userQuizAnswerError = BaseZodError<typeof userQuizAnswerSchema>;

export type userChatBotInputError = BaseZodError<typeof userChatBotInputSchema>;
