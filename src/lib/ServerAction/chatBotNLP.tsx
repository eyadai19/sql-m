// "use server";
import axios from "axios";
import { z } from "zod";
import {
	userChatBotInputSchema,
	userExcerciseAnswerError,
} from "../types/userSchema";

export async function ChatbotAction(
	input: z.infer<typeof userChatBotInputSchema>,
): Promise<{ answer: string } | userExcerciseAnswerError | undefined> {
	"use server";
	try {
		const question = await userChatBotInputSchema.parseAsync({ input });
		const response = await axios.post("http://localhost:3000/chatbot", {
			question,
		});
		return { answer: response.data.answer };
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}

export async function ChatbotExpAction(
	input: z.infer<typeof userChatBotInputSchema>,
): Promise<
	| { answer: String }
	| { question: String; answers: String[] }
	| userExcerciseAnswerError
	| undefined
> {
	"use server";
	try {
		const choose = await userChatBotInputSchema.parseAsync({ input });
		const response = await axios.post("http://localhost:3000/chatbot", {
			choose,
		});
		if (response.data) return { answer: response.data.answer };
		else {
			const a = ["d", "d"]; // get the answers array from response json
			// const asnwers = a.map((x) => ({ asnwer: x }));
			return { question: response.data.asnw, answers: a };
		}
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}
