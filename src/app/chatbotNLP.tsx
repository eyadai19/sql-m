import { ChatbotAction } from "@/lib/ServerAction/chatBotNLP";
import { useState } from "react";

export default function ChatbotPage() {
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		setLoading(true);
		setAnswer(null);
		setError(null);

		const result = await ChatbotAction({ question });

		if (result && "answer" in result) {
			setAnswer(result.answer);
		} else if (result && "message" in result) {
			setError(result.message);
		}
		setLoading(false);
	};

	return (
		<div className="mx-auto max-w-md p-4">
			<h1 className="mb-4 text-2xl font-bold">Chatbot</h1>
			<input
				type="text"
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
				placeholder="اكتب سؤالك هنا"
				className="mb-2 w-full rounded border border-gray-300 p-2"
			/>
			<button
				onClick={handleSubmit}
				disabled={loading}
				className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
			>
				{loading ? "يتم الإرسال..." : "إرسال"}
			</button>
			{answer && (
				<div className="mt-4 rounded border border-green-300 bg-green-100 p-2">
					<strong>الإجابة:</strong> {answer}
				</div>
			)}
			{error && (
				<div className="mt-4 rounded border border-red-300 bg-red-100 p-2">
					<strong>خطأ:</strong> {error}
				</div>
			)}
		</div>
	);
}
