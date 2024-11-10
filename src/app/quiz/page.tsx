import SqlQuiz from "@/components/Quiz";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_quiz } from "@/lib/schema";
import {
	userExcerciseAnswerError,
	userQuizAnswerSchema,
} from "@/lib/types/userSchema";
import { nanoid } from "nanoid";
import { z } from "zod";

interface QuizPageProps {
	params: {
		stageId: string;
	};
}

export default function quiz({ params }: QuizPageProps) {
	return (
		<SqlQuiz
			quizAction={quizAction}
			quizQuestionAction={quizQuestionAction.bind(null, params.stageId)}
		/>
	);
}

async function quizQuestionAction(
	stageId: string,
): Promise<
	{ question: string }[] | { field: string; message: string } | undefined
> {
	"use server";
	try {
		const levels = await db.query.TB_level.findMany({
			where: (level, { eq }) => eq(level.stageId, stageId),
		});

		if (!levels || levels.length === 0) return [];
		const levelIds = levels.map((level) => level.id);
		const questions = await db.query.TB_question_bank.findMany({
			where: (question, { inArray }) => inArray(question.levelId, levelIds),
		});
		return questions.map((q) => ({ question: q.question }));
	} catch {
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
			where: (question, { eq }) => eq(question.question, data.question[0]), // edit s to param
		});
		if (!que) return;
		const leveId = await db.query.TB_level.findFirst({
			where: (level, { eq }) => eq(level.id, que.levelId),
		});
		if (!leveId) return;

		let score = 0;
		for (let index = 0; index < data.question.length; index++) {
			const question = await db.query.TB_question_bank.findFirst({
				where: (question, { eq }) =>
					eq(question.question, data.question[index]),
			});
			if (!question) return;
			if (question.answer == data.answer[index]) score++;
		}

		const user = await getUser();
		if (!user) return;

		const newQuiz = {
			id: nanoid(),
			userId: user.id,
			mark: score,
			stageId: leveId.stageId,
		};

		try {
			await db.insert(TB_quiz).values(newQuiz);
		} catch {
			return { field: "root", message: "error" };
		}

		return { score, correctAnswers };
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}
