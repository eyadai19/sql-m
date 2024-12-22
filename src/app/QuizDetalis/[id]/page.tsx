import QuizDetalisPage from "@/components/QuizDetalisPage";
import { db } from "@/lib/db";

export default function QuizDetalis({ params }: { params: { id: string } }) {

	return (
		<QuizDetalisPage
			QuizDetailsAction={QuizDetailsAction.bind(null, params.id)}
		/>
	);
}

async function QuizDetailsAction(
	quizId: string,
): Promise<
	| { question: string; answer: string; score: number }[]
	| { field: string; message: string }
	| undefined
> {
	"use server";

	try {
		const quizDetails = await db.query.TB_quiz_questions.findMany({
			where: (question, { eq }) => eq(question.quizId, quizId),
		});

		if (!quizDetails || quizDetails.length === 0) {
			return { field: "root", message: "No questions found for this quiz" };
		}

		const result = quizDetails.map(({ question, answer, score }) => ({
			question,
			answer,
			score,
		}));

		return result;
	} catch {
		return { field: "root", message: "error" };
	}
}
