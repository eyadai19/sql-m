import { getAuthorizedQuiz } from "@/app/(main)/layout";
import { logoutAction } from "@/app/Profile/page";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import SqlQuiz from "@/components/Quiz";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	TB_quiz,
	TB_quiz_drag_drop_options,
	TB_quiz_multiple_choice_options,
	TB_quiz_questions,
	TB_user,
} from "@/lib/schema";
import { ExerciseTypes, QuizInput } from "@/lib/types/exerciseTypes";
import { userExcerciseAnswerError } from "@/lib/types/userSchema";
import { ngrok_url_compare } from "@/utils/apis";
import axios from "axios";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Quiz",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

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

async function quizQuestionAction(stageId: string): Promise<
	| { field: string; message: string }
	| undefined
	| (
			| { question: string; type: "NormalExercise" | "TrueFalseExercise" }
			| {
					question: string;
					type: "DragDropExercise" | "MultipleChoiceExercise";
					options: string[];
			  }
	  )[]
> {
	"use server";
	try {
		const levels = await db.query.TB_level.findMany({
			where: (level, { eq }) => eq(level.stageId, stageId),
		});
		if (!levels || levels.length === 0) {
			return [];
		}
		const levelIds = levels.map((level) => level.id);

		const normalQuestions = await db.query.TB_question_bank.findMany({
			where: (question, { inArray }) => inArray(question.levelId, levelIds),
		});

		const multipleChoiceQuestions =
			await db.query.TB_MultipleChoice_bank.findMany({
				where: (question, { inArray }) => inArray(question.levelId, levelIds),
			});

		const dragDropQuestions = await db.query.TB_DragDrop_bank.findMany({
			where: (question, { inArray }) => inArray(question.levelId, levelIds),
		});

		const trueFalseQuestions = await db.query.TB_TrueFalse_bank.findMany({
			where: (question, { inArray }) => inArray(question.levelId, levelIds),
		});

		const multipleChoiceOptions =
			await db.query.TB_MultipleChoice_options.findMany({
				where: (option, { inArray }) =>
					inArray(
						option.questionId,
						multipleChoiceQuestions.map((q) => q.id),
					),
			});

		const dragDropOptions = await db.query.TB_DragDrop_options.findMany({
			where: (option, { inArray }) =>
				inArray(
					option.questionId,
					dragDropQuestions.map((q) => q.id),
				),
		});

		const user = await getUser();
		if (!user) return;

		const userParams = await db.query.TB_user_excercise_summary.findMany({
			where: (u, { eq }) => eq(u.userId, user.id),
		});

		const bestUserParams = userParams.reduce(
			(acc, curr) => {
				const existing = acc[curr.levelId];
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

		const maxTime = Math.max(...userParams.map((param) => param.time!));
		const maxTrials = Math.max(...userParams.map((param) => param.trials!));

		const w1 = -0.3;
		const w2 = 0.2;
		const w3 = 0.2;
		const w4 = 1000;

		const levelQuestionsCount = levels.map((level) => {
			const userLevelData = bestUserParams[level.id];
			if (!userLevelData) {
				return { levelId: level.id, questionCount: 8 };
			}

			const { score, time, trials, is_show_ans } = userLevelData;

			const normalizedScore =
				score === null ? 0 : Math.min(1, parseFloat(score) / 100);
			const normalizedTime = time! / maxTime;
			const normalizedTrials = trials! / maxTrials;
			const normalizedIsShowAns = is_show_ans ? 1 : 0;

			let questionCount =
				w1 * normalizedScore +
				w2 * normalizedTime +
				w3 * normalizedTrials +
				w4 * normalizedIsShowAns;

			questionCount = Math.min(Math.max(questionCount, 0), 8);

			return { levelId: level.id, questionCount: Math.round(questionCount) };
		});

		const resultQuestions: (
			| { question: string; type: "TrueFalseExercise" | "NormalExercise" }
			| {
					question: string;
					type: "DragDropExercise" | "MultipleChoiceExercise";
					options: string[];
			  }
		)[] = levelQuestionsCount.flatMap(({ levelId, questionCount }) => {
			const selectedQuestions = [];

			if (questionCount <= 4) {
				if (normalQuestions.length > 0) {
					selectedQuestions.push({
						question: normalQuestions[0].question,
						type: ExerciseTypes.Normal,
					});
				}
				if (
					multipleChoiceQuestions.length > 0 &&
					selectedQuestions.length < questionCount
				) {
					const options = multipleChoiceOptions
						.filter(
							(option) => option.questionId === multipleChoiceQuestions[0].id,
						)
						.map((option) => option.option);
					selectedQuestions.push({
						question: multipleChoiceQuestions[0].question,
						type: ExerciseTypes.MultipleChoice,
						options: options,
					});
				}
				if (
					dragDropQuestions.length > 0 &&
					selectedQuestions.length < questionCount
				) {
					const options = dragDropOptions
						.filter((option) => option.questionId === dragDropQuestions[0].id)
						.map((option) => option.option);
					selectedQuestions.push({
						question: dragDropQuestions[0].question,
						type: ExerciseTypes.DragDrop,
						options: options,
					});
				}
				if (
					trueFalseQuestions.length > 0 &&
					selectedQuestions.length < questionCount
				) {
					selectedQuestions.push({
						question: trueFalseQuestions[0].question,
						type: ExerciseTypes.TrueFalse,
					});
				}
			} else {
				// توزيع الأسئلة بشكل متساوٍ إذا كان العدد كبيرًا
				selectedQuestions.push(
					...normalQuestions
						.filter((q) => q.levelId === levelId)
						.slice(0, Math.ceil(questionCount / 4))
						.map((q) => ({
							question: q.question,
							type: ExerciseTypes.Normal,
						})),
					...multipleChoiceQuestions
						.filter((q) => q.levelId === levelId)
						.slice(0, Math.ceil(questionCount / 4))
						.map((q) => ({
							question: q.question,
							type: ExerciseTypes.MultipleChoice,
							options: multipleChoiceOptions
								.filter((option) => option.questionId === q.id)
								.map((option) => option.option),
						})),
					...dragDropQuestions
						.filter((q) => q.levelId === levelId)
						.slice(0, Math.ceil(questionCount / 4))
						.map((q) => ({
							question: q.question,
							type: ExerciseTypes.DragDrop,
							options: dragDropOptions
								.filter((option) => option.questionId === q.id)
								.map((option) => option.option),
						})),
					...trueFalseQuestions
						.filter((q) => q.levelId === levelId)
						.slice(0, Math.ceil(questionCount / 4))
						.map((q) => ({
							question: q.question,
							type: ExerciseTypes.TrueFalse,
						})),
				);
			}
			return selectedQuestions.slice(0, questionCount);
		});

		return resultQuestions;
	} catch (error) {
		console.error("Error fetching questions:", error);
		return { field: "root", message: "error" };
	}
}

async function quizAction(
	stageId: string,
	data: QuizInput,
): Promise<
	| { score: number; correctAnswers: string[] }
	| userExcerciseAnswerError
	| undefined
> {
	"use server";

	try {
		const correctAnswers: string[] = [];
		const quizQuestions = [];
		let score = 0;

		const quizId = nanoid();

		const user = await getUser();
		if (!user) return;
		const newQuiz = {
			id: quizId,
			userId: user.id,
			mark: 0,
			stageId: stageId,
		};

		await db.insert(TB_quiz).values(newQuiz);

		for (let index = 0; index < data.length; index++) {
			const currentQuestionData = data[index];
			let questionScore = 0;
			let newQuestion: any;

			switch (currentQuestionData.type) {
				case "NormalExercise":
					const question = await db.query.TB_question_bank.findFirst({
						where: (question, { eq }) =>
							eq(question.question, currentQuestionData.question),
					});
					if (!question) return;
					const answer = currentQuestionData.answer;
					const realAnswer = question.answer;

					const response = await axios.post(ngrok_url_compare, {
						sentence1: answer,
						sentence2: realAnswer,
					});
					questionScore = Math.abs(response.data.cosine_similarity) * 100;

					correctAnswers.push(question.answer);
					newQuestion = {
						id: nanoid(),
						quizId: quizId,
						question: currentQuestionData.question,
						answer: answer,
						score: questionScore,
						type: currentQuestionData.type,
					};
					score += questionScore;

					await db.insert(TB_quiz_questions).values(newQuestion);
					break;

				case "TrueFalseExercise":
					const TrueFalsequestion = await db.query.TB_TrueFalse_bank.findFirst({
						where: (question, { eq }) =>
							eq(question.question, currentQuestionData.question),
					});
					if (!TrueFalsequestion) return;

					const TrueFalseAnswer = currentQuestionData.answer;
					const TrueFalseRealAnswer = TrueFalsequestion.answer;
					questionScore = TrueFalseAnswer === TrueFalseRealAnswer ? 100 : 0;

					correctAnswers.push(TrueFalsequestion.answer);
					newQuestion = {
						id: nanoid(),
						quizId: quizId,
						question: currentQuestionData.question,
						answer: TrueFalseAnswer,
						score: questionScore,
						type: currentQuestionData.type,
					};
					score += questionScore;

					await db.insert(TB_quiz_questions).values(newQuestion);
					break;

				case "MultipleChoiceExercise":
					const MultipleChoicequestion =
						await db.query.TB_MultipleChoice_bank.findFirst({
							where: (question, { eq }) =>
								eq(question.question, currentQuestionData.question),
						});
					if (!MultipleChoicequestion) return;

					const MultipleChoiceAnswer = currentQuestionData.answer;
					const MultipleChoiceRealAnswer = MultipleChoicequestion.answer;
					questionScore =
						MultipleChoiceAnswer === MultipleChoiceRealAnswer ? 100 : 0;

					correctAnswers.push(MultipleChoicequestion.answer);
					newQuestion = {
						id: nanoid(),
						quizId: quizId,
						question: currentQuestionData.question,
						answer: currentQuestionData.answer,
						score: questionScore,
						type: currentQuestionData.type,
					};

					await db.insert(TB_quiz_questions).values(newQuestion);

					const multipleChoiceOptions = currentQuestionData.options.map(
						(option, idx) => ({
							id: nanoid(),
							questionId: newQuestion.id,
							option,
							order: idx + 1,
						}),
					);

					await db
						.insert(TB_quiz_multiple_choice_options)
						.values(multipleChoiceOptions);
					break;

				case "DragDropExercise":
					const DragDropquestion = await db.query.TB_DragDrop_bank.findFirst({
						where: (question, { eq }) =>
							eq(question.question, currentQuestionData.question),
					});
					if (!DragDropquestion) return;

					const DragDropquestionOrder =
						await db.query.TB_DragDrop_options.findMany({
							where: (question, { eq }) =>
								eq(question.questionId, DragDropquestion.id),
						});
					if (!DragDropquestionOrder) return;

					const DragDropAnswer = currentQuestionData.order;
					const correctOrder = DragDropquestionOrder.map(
						(option) => option.option,
					);

					questionScore =
						JSON.stringify(DragDropAnswer) === JSON.stringify(correctOrder)
							? 100
							: 0;

					correctAnswers.push(correctOrder.join(", "));
					newQuestion = {
						id: nanoid(),
						quizId: quizId,
						question: currentQuestionData.question,
						answer: DragDropAnswer.join(", "),
						score: questionScore,
						type: currentQuestionData.type,
					};

					await db.insert(TB_quiz_questions).values(newQuestion);

					const dragDropOptions = currentQuestionData.order.map(
						(option, idx) => ({
							id: nanoid(),
							questionId: newQuestion.id, // استخدام معرف السؤال الذي تم إنشاؤه
							option,
							order: idx + 1,
						}),
					);

					await db.insert(TB_quiz_drag_drop_options).values(dragDropOptions);
					break;

				default:
					return;
			}

			quizQuestions.push(newQuestion);
		}

		score = score / data.length;

		await db.update(TB_quiz).set({ mark: score }).where(eq(TB_quiz.id, quizId));

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
