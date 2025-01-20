// "use server";
import {
	getContextApi,
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
	var table;
	try {
		const response = await fetch(getContextApi);
		const data = await response.json();
		if (!response.ok) {
			alert(data.error || "خطأ أثناء جلب الجداول.");
			return;
		}
		table = data["context"];
	} catch (error) {
		console.error("خطأ أثناء جلب الجداول:", error);
		alert("حدث خطأ أثناء جلب الجداول.");
		return { field: "root", message: "Failed to fetch table" };
	}
	try {
		if (!input || !input.question) {
			// console.log(
			// 	"The 'input' object must contain a valid 'question' property.",
			// );
		}
		const input_prompt = table + "\nquery for: " + input.question;
		const response = await axios.post(ngrok_url_generate_sql, {
			input_prompt: input_prompt,
		});
		return { answer: response.data["generated_sql"] };
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}

export async function ChatbotWithNewContextAction(
	input: z.infer<typeof userChatBotInputSchema>,
	context: string,
): Promise<{ answer: string } | userExcerciseAnswerError | undefined> {
	"use server";

	try {
		if (!input || !input.question) {
			// console.log(
			// 	"The 'input' object must contain a valid 'question' property.",
			// );
		}
		const input_prompt = context + "\nquery for: " + input.question;
		const response = await axios.post(ngrok_url_generate_sql, {
			input_prompt: input_prompt,
		});
		return { answer: response.data["generated_sql"] };
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}

export async function ChatbotTrEnToAr(
	input: z.infer<typeof userChatBotInputSchema>,
): Promise<{ answer: string } | userExcerciseAnswerError | undefined> {
	"use server";
	try {
		// const text = await userChatBotInputSchema.parseAsync({ input });
		const response = await axios.post(ngrok_url_en_to_ar, {
			text: input.question,
		});
		if (response.data) return { answer: response.data["translated_text"] };
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}

export async function ChatbotTrArToEn(
	input: z.infer<typeof userChatBotInputSchema>,
): Promise<{ answer: string } | userExcerciseAnswerError | undefined> {
	"use server";
	try {
		// const text = await userChatBotInputSchema.parseAsync({ input });
		const response = await axios.post(ngrok_url_ar_to_en, {
			text: input.question,
		});
		if (response.data) return { answer: response.data["translated_text"] };
	} catch (error) {
		console.error("Error sending question to API:", error);
		return { field: "root", message: "Failed to retrieve answer" };
	}
}