import { getAuthorizedQuiz } from "@/app/(main)/layout";
import SqlQuiz from "@/components/Quiz";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_quiz, TB_quiz_questions } from "@/lib/schema";
import {
	userExcerciseAnswerError,
	userQuizAnswerSchema,
} from "@/lib/types/userSchema";
import { ngrok_url_compare } from "@/utils/apis";
import axios from "axios";
import { nanoid } from "nanoid";
import { z } from "zod";

export default function quiz({ params }: { params: { id: string } }) {
	return (
		<SqlQuiz
			quizAction={quizAction}
			quizQuestionAction={quizQuestionAction.bind(null, params.id)}
			getAuthorizedQuiz={getAuthorizedQuiz.bind(null, params.id)}
		/>
	);
}

async function quizQuestionAction(stageId: string) {
	"use server";
	try {
		const levels = await db.query.TB_level.findMany({
			where: (level, { eq }) => eq(level.stageId, stageId), //stageId
		});
		if (!levels || levels.length === 0) {
			return [];
		}
		const levelIds = levels.map((level) => level.id);

		const questions = await db.query.TB_question_bank.findMany({
			where: (question, { inArray }) => inArray(question.levelId, levelIds),
		});
		return questions.map((q) => ({ question: q.question }));
	} catch (error) {
		console.error("Error fetching questions:", error);
		return { field: "root", message: "error" };
	}
}

async function quizAction(
	input: z.infer<typeof userQuizAnswerSchema>,
): Promise<
	| { score: number; correctAnswers: string[] }
	| userExcerciseAnswerError
	| undefined
> {
	"use server";

	try {
		const data = await userQuizAnswerSchema.parseAsync(input);

		const correctAnswers: string[] = [];
		const que = await db.query.TB_question_bank.findFirst({
			where: (question, { eq }) => eq(question.question, data.question[0]),
		});
		if (!que) return;

		const levelId = await db.query.TB_level.findFirst({
			where: (level, { eq }) => eq(level.id, que.levelId),
		});
		if (!levelId) return;

		let score = 0;
		const quizQuestions = [];

		for (let index = 0; index < data.question.length; index++) {
			const question = await db.query.TB_question_bank.findFirst({
				where: (question, { eq }) =>
					eq(question.question, data.question[index]),
			});
			if (!question) return;

			const answer = data.answer[index];
			const realAnswer = question.answer;
			const response = await axios.post(ngrok_url_compare, {
				sentence1: answer,
				sentence2: realAnswer,
			});
			const score = Math.abs(response.data.cosine_similarity) * 100;

			correctAnswers.push(question.answer);
			quizQuestions.push({
				id: nanoid(),
				quizId: "",
				question: data.question[index],
				answer: data.answer[index],
				score: score,
			});
		}
		quizQuestions.forEach((question) => (score += question.score));
		score = score / data.question.length;
		const user = await getUser();
		if (!user) return;
		const newQuiz = {
			id: nanoid(),
			userId: user.id,
			mark: score,
			stageId: levelId.stageId,
		};
		console.log("New Quiz Data:", newQuiz);

		try {
			await db.insert(TB_quiz).values(newQuiz);
		} catch (error) {
			console.error("Error inserting into TB_quiz:", error);
			return { field: "root", message: "Error inserting quiz data" };
		}
		quizQuestions.forEach((question) => (question.quizId = newQuiz.id));

		try {
			await db.insert(TB_quiz_questions).values(quizQuestions);
		} catch (error) {
			console.error("Error inserting into TB_quiz_questions:", error);
			return { field: "root", message: "Error inserting quiz questions data" };
		}

		return { score, correctAnswers };
	} catch (e) {
		console.error(e);
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}
