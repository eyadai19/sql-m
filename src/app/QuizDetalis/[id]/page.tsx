import QuizDetalisPage from "@/components/QuizDetalisPage";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	DragDropExercise,
	ExerciseTypes,
	MultipleChoiceExercise,
	NormalExercise,
	QuizView,
	TrueFalseExercise,
} from "@/lib/types/exerciseTypes";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Quiz Details",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

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
		const user = await getUser();
		if (!user) {
			return { field: "user", message: "User not authenticated." };
		}

		const quiz = await db.query.TB_quiz.findFirst({
			where: (quiz, { eq }) => eq(quiz.id, quizId) && eq(quiz.userId, user.id),
		});

		if (!quiz) {
			return {
				field: "quizId",
				message: "Quiz does not belong to the current user.",
			};
		}

		const quizNormalDetails = await db.query.TB_quiz_questions.findMany({
			where: (question, { eq, and }) =>
				and(
					eq(question.quizId, quizId),
					eq(question.type, ExerciseTypes.Normal),
				),
		});

		const quizTrueAndFalseDetails = await db.query.TB_quiz_questions.findMany({
			where: (question, { eq, and }) =>
				and(
					eq(question.quizId, quizId),
					eq(question.type, ExerciseTypes.TrueFalse),
				),
		});

		const quizMcqDetails = await db.query.TB_quiz_questions.findMany({
			where: (question, { eq, and }) =>
				and(
					eq(question.quizId, quizId),
					eq(question.type, ExerciseTypes.MultipleChoice),
				),
			with: { multipleChoiceOptions: true },
		});

		const quizDragDropDetails = await db.query.TB_quiz_questions.findMany({
			where: (question, { eq, and }) =>
				and(
					eq(question.quizId, quizId),
					eq(question.type, ExerciseTypes.DragDrop),
				),
			with: { dragDropOptions: true },
		});

		const normalQuestions = quizNormalDetails.map(
			({ question, answer, score }): NormalExercise => ({
				question,
				answer,
				score,
				type: "NormalExercise",
			}),
		);

		const trueFalseQuestions = quizTrueAndFalseDetails.map(
			({ question, answer, score }): TrueFalseExercise => ({
				question,
				answer,
				score,
				type: "TrueFalseExercise",
			}),
		);

		const mcqQuestions = quizMcqDetails.map(
			({
				question,
				answer,
				score,
				multipleChoiceOptions,
			}): MultipleChoiceExercise => ({
				question,
				answer,
				score,
				type: "MultipleChoiceExercise",
				options: multipleChoiceOptions.map((opt) => opt.option),
			}),
		);

		const dragDropQuestions = quizDragDropDetails.map(
			({ question, score, dragDropOptions }): DragDropExercise => ({
				question,
				score,
				type: "DragDropExercise",
				options: dragDropOptions.map((opt) => opt.option),
				order: dragDropOptions.map((opt) => opt.order.toString()),
			}),
		);

		return [
			...normalQuestions,
			...trueFalseQuestions,
			...mcqQuestions,
			...dragDropQuestions,
		];
	} catch (error) {
		console.error("Error fetching quiz details:", error);
		return {
			field: "root",
			message: "An error occurred while fetching the quiz details.",
		};
	}
}
