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

export default function Quiz() {
	return <SqlQuiz />;
}

async function quizAction(
	input: z.infer<typeof userQuizAnswerSchema>,
): Promise<userExcerciseAnswerError | undefined> {
	"use server";

	try {
		const data = await userQuizAnswerSchema.parseAsync(input);
		const que = await db.query.TB_question_bank.findFirst({
			where: (question, { eq }) => eq(question.question, data.question[0]), // edit s to param
		});
		if (!que) return;
		const leveId = await db.query.TB_level.findFirst({
			where: (level, { eq }) => eq(level.id, que.id),
		});
		if (!leveId) return;

		var score = 0;
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
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}
}
