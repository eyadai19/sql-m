import QuizDetalisPage from "@/components/QuizDetalisPage";
import { db } from "@/lib/db";
import { ExerciseTypes, QuizView } from "@/lib/types/exerciseTypes";

export default function QuizDetalis({ params }: { params: { id: string } }) {
	return (
		<QuizDetalisPage
			QuizDetailsAction={QuizDetailsAction.bind(null, params.id)}
		/>
	);
}

async function QuizDetailsAction(
	quizId: string,
): Promise<QuizView | { field: string; message: string } | undefined> {
	"use server";

	try {
		// Fetch Normal questions
		const quizNormalDetails = await db.query.TB_quiz_questions.findMany({
			where: (question, { eq }) =>
				eq(question.quizId, quizId) && eq(question.type, ExerciseTypes.Normal),
		});

		// Fetch True/False questions
		const quizTrueAndFalseDetails = await db.query.TB_quiz_questions.findMany({
			where: (question, { eq }) =>
				eq(question.quizId, quizId) &&
				eq(question.type, ExerciseTypes.TrueFalse),
		});

		// Fetch Multiple Choice questions with options
		const quizMcqDetails = await db.query.TB_quiz_questions.findMany({
			where: (question, { eq }) =>
				eq(question.quizId, quizId) &&
				eq(question.type, ExerciseTypes.MultipleChoice),
			with: {
				options: true,
			},
		});

		// Fetch Drag and Drop questions with options
		const quizDragDropDetails = await db.query.TB_quiz_questions.findMany({
			where: (question, { eq }) =>
				eq(question.quizId, quizId) &&
				eq(question.type, ExerciseTypes.DragDrop),
			with: {
				options: true,
			},
		});

		const normalQuestions = quizNormalDetails.map(
			({ question, answer, score }) => ({
				question,
				answer,
				score,
				type: "NormalExercise",
			}),
		);

		const trueFalseQuestions = quizTrueAndFalseDetails.map(
			({ question, answer, score }) => ({
				question,
				answer,
				score,
				type: "TrueFalseExercise",
			}),
		);

		const mcqQuestions = quizMcqDetails.map(
			({ question, answer, score, options }) => ({
				question,
				answer,
				score,
				type: "MultipleChoiceExercise",
				options: options.map((opt) => opt.option),
			}),
		);

		const dragDropQuestions = quizDragDropDetails.map(
			({ question, score, options }) => ({
				question,
				score,
				type: "DragDropExercise",
				options: options.map((opt) => opt.option),
				order: options.map((opt) => opt.order.toString()),
			}),
		);

		// Combine all results
		const result = [
			...normalQuestions,
			...trueFalseQuestions,
			...mcqQuestions,
			...dragDropQuestions,
		];

		return result;
	} catch (error) {
		console.error("Error fetching quiz details:", error);
		return {
			field: "root",
			message: "An error occurred while fetching the quiz details.",
		};
	}
}
