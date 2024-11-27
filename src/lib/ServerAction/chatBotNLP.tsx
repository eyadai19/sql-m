// "use server";
import {
	ngrok_url_ar_to_en,
	ngrok_url_en_to_ar,
	ngrok_url_generate_sql,
} from "@/utils/apis";
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
		const response = await axios.post(ngrok_url_generate_sql, {
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

export async function ChatbotTrEnToAr(
	input: z.infer<typeof userChatBotInputSchema>,
): Promise<{ answer: String } | userExcerciseAnswerError | undefined> {
	"use server";
	try {
		const text = await userChatBotInputSchema.parseAsync({ input });
		const response = await axios.post(ngrok_url_en_to_ar, {
			text,
		});
		if (response.data) return { answer: response.data.answer };
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}

export async function ChatbotTrArToEn(
	input: z.infer<typeof userChatBotInputSchema>,
): Promise<{ answer: String } | userExcerciseAnswerError | undefined> {
	"use server";
	try {
		const text = await userChatBotInputSchema.parseAsync({ input });
		const response = await axios.post(ngrok_url_ar_to_en, {
			text,
		});
		if (response.data) return { answer: response.data.answer };
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}

// when use ar in nlp => use ChatbotTrArToEn then ChatbotAction then ChatbotTrArToEn
