import { getAuthorizedQuiz } from "@/app/(main)/layout";
import { logoutAction } from "@/app/Profile/page";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import SqlQuiz from "@/components/Quiz";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_quiz, TB_quiz_questions, TB_user } from "@/lib/schema";
import {
	userExcerciseAnswerError,
	userQuizAnswerSchema,
} from "@/lib/types/userSchema";
import { ngrok_url_compare } from "@/utils/apis";
import axios from "axios";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

export default function quiz({ params }: { params: { id: string } }) {
	return (
		<div>
			<ProfileNavbar logoutAction={logoutAction} />

			<SqlQuiz
				quizAction={quizAction.bind(null, params.id)}
				quizQuestionAction={quizQuestionAction.bind(null, params.id)}
				getAuthorizedQuiz={getAuthorizedQuiz.bind(null, params.id)}
			/>
		</div>
	);
}

async function quizQuestionAction(stageId: string) {
	"use server";
	try {
		const levels = await db.query.TB_level.findMany({
			where: (level, { eq }) => eq(level.stageId, stageId),
		});
		if (!levels || levels.length === 0) {
			return [];
		}
		const levelIds = levels.map((level) => level.id);

		const questions = await db.query.TB_question_bank.findMany({
			where: (question, { inArray }) => inArray(question.levelId, levelIds),
		});

		const user = await getUser();
		if (!user) return;

		const userParams = await db.query.TB_user_excercise_summary.findMany({
			where: (u, { eq }) => eq(u.userId, user.id),
		});

		const bestUserParams = userParams.reduce(
			(acc, curr) => {
				const currentScore = parseFloat(curr.score!);
				if (
					!existing ||
					(currentScore && parseFloat(existing.score!) < currentScore)
				) {
					acc[curr.levelId] = { ...curr, score: currentScore.toString() };
				}
				return acc;
			},
			{} as Record<string, (typeof userParams)[0]>,
		);

		// حساب القيمة القصوى للوقت والمحاولات
		const maxTime = Math.max(...userParams.map((param) => param.time!));
		const maxTrials = Math.max(...userParams.map((param) => param.trials!));

		// تحديد الأوزان
		const w1 = -0.3; // الوزن للـ score (سلبي)
		const w2 = 0.2; // الوزن للـ time
		const w3 = 0.2; // الوزن للـ trials
		const w4 = 1000; // الوزن للـ is_show_ans (عالي جدًا)

		const levelQuestionsCount = levels.map((level) => {
			const userLevelData = bestUserParams[level.id];
			if (!userLevelData) {
				// إذا لم توجد بيانات للمستخدم لهذه اللفلة، قم بتحديد 5 أسئلة افتراضيًا
				return { levelId: level.id, questionCount: 5 };
			}

			const { score, time, trials, is_show_ans } = userLevelData;

			// تطبيع البيانات بناءً على القيم القصوى
			const normalizedScore = Math.min(1, parseFloat(score!) / 100);
			const normalizedTime = time! / maxTime; // تطبيع الوقت بناءً على القيمة القصوى
			const normalizedTrials = trials! / maxTrials; // تطبيع المحاولات بناءً على القيمة القصوى
			const normalizedIsShowAns = is_show_ans ? 1 : 0;

			// حساب عدد الأسئلة بناءً على المعادلة
			let questionCount =
				w1 * normalizedScore +
				w2 * normalizedTime +
				w3 * normalizedTrials +
				w4 * normalizedIsShowAns;

			questionCount = Math.min(Math.max(questionCount, 0), 5);

			return { levelId: level.id, questionCount: Math.round(questionCount) };
		});

		const resultQuestions = levelQuestionsCount.flatMap(
			({ levelId, questionCount }) => {
				const questionsForLevel = questions.filter(
					(q) => q.levelId === levelId,
				);
				return questionsForLevel
					.slice(0, questionCount)
					.map((q) => ({ question: q.question }));
			},
		);

		return resultQuestions;
	} catch (error) {
		console.error("Error fetching questions:", error);
		return { field: "root", message: "error" };
	}
}

async function quizAction(
	stageId: string,
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

		const stage = await db.query.TB_stage.findFirst({
			where: (stage, { eq }) => eq(stage.id, stageId),
		});
		if (!stage) return;
		if (stage.index != 4) {
			const x = stage.index + 1;
			const userInfo = await db.query.TB_user.findFirst({
				where: (u, { eq }) => eq(u.id, user.id),
				with: {
					stage: true,
				},
			});
			if (!userInfo) return;

			if (userInfo.stage.index < x) {
				const newStage = await db.query.TB_stage.findFirst({
					where: (s, { eq }) => eq(s.index, x),
				});
				if (!newStage) return;

				await db
					.update(TB_user)
					.set({
						stageId: newStage.id,
					})
					.where(eq(TB_user.id, user.id));
			}
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
