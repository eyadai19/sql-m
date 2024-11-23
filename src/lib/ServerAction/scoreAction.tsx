import axios from "axios";
import { z } from "zod";
import { db } from "../db";
import {
	userChatBotInputSchema,
	userExcerciseAnswerError,
} from "../types/userSchema";

export async function ChatbotTrArToEn(
	input: z.infer<typeof userChatBotInputSchema>,
): Promise<{ answer: String } | userExcerciseAnswerError | undefined> {
	"use server";
	try {
		const question = await userChatBotInputSchema.parseAsync(input);
		const que = await db.query.TB_question_bank.findFirst({
			where: (que, { eq }) => eq(que.question, question),
		});
		if (!que) return;

		const levelId = await db.query.TB_level.findFirst({
			where: (level, { eq }) => eq(level.id, que.levelId),
		});
		if (!levelId) return;

		const response = await axios.post("http://localhost:3000/tr-ar-to-en", {
			text,
		});
		if (response.data) return { answer: response.data.answer };
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}
