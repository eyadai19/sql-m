"use server";
import axios from "axios";
import { z } from "zod";
import {
	userChatBotInputSchema,
	userExcerciseAnswerError,
	userExcerciseAnswerSchema,
} from "../types/userSchema";

export async function ChatbotAction(
	input: z.infer<typeof userChatBotInputSchema>,
): Promise<{ answer: string } | userExcerciseAnswerError | undefined> {
	"use server";
	try {
		const question = await userExcerciseAnswerSchema.parseAsync({ input });
		const response = await axios.post("http://localhost:3000/chatbot", {
			question,
		});
		return { answer: response.data.answer };
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}
