"use client";

import { ExerciseTypes, TrueFalseQuestion } from "@/lib/types/exerciseTypes";
import {
	userExcerciseAnswerError,
	userExcerciseAnswerSchema,
} from "@/lib/types/userSchema";
import { useState } from "react";
import { z } from "zod";

export function useExerciseState(
	questions: TrueFalseQuestion[],
	UserExcerciseAnswerAction: (
		input: z.infer<typeof userExcerciseAnswerSchema>,
		score: number | null,
		type: string,
	) => Promise<userExcerciseAnswerError | undefined>,
) {
	const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
	const [showExplanations, setShowExplanations] = useState<
		Record<string, boolean>
	>({});
	const [attempts, setAttempts] = useState(0);
	const [isCompleted, setIsCompleted] = useState(false);
	const [startTime] = useState(Date.now());
	const [activeHint, setActiveHint] = useState(0);
	const [showHints, setShowHints] = useState(true);
	const [showTips, setShowTips] = useState(false);
	const [showAnswer, setShowAnswer] = useState(false);

	const handleAnswer = (questionId: string, answer: boolean) => {
		if (isCompleted) return;

		setAnswers((prev) => ({
			...prev,
			[questionId]: answer,
		}));
		setShowExplanations((prev) => ({
			...prev,
			[questionId]: true,
		}));
		if (answer !== questions.find((q) => q.id === questionId)?.isCorrect) {
			setAttempts((prev) => prev + 1);
		}

		const updatedAnswers = {
			...answers,
			[questionId]: answer,
		};

		checkCompletion(updatedAnswers);
	};

	const checkCompletion = async (
		currentAnswers: Record<string, boolean | null>,
	) => {
		const allCorrect = questions.every(
			(q) => currentAnswers[q.id] === q.isCorrect,
		);
		const allAnswered = questions.every(
			(q) =>
				currentAnswers[q.id] !== null && currentAnswers[q.id] !== undefined,
		);

		if (allCorrect && allAnswered && !isCompleted) {
			setIsCompleted(true);
			const timeSpent = Math.round((Date.now() - startTime) / 1000);
			const inputData = {
				time: timeSpent,
				is_show_ans: showAnswer,
				trials: attempts + 1,
			};
			try {
				await UserExcerciseAnswerAction(
					inputData,
					null,
					ExerciseTypes.TrueFalse,
				);
			} catch (error) {
				console.error("UserExcerciseAnswerAction error:", error);
			}
		}
	};

	const handleReset = () => {
		setAnswers({});
		setShowExplanations({});
		setAttempts(0);
		setIsCompleted(false);
		setShowAnswer(false);
		setActiveHint(-1);
		setShowHints(false);
		setCorrectAnswers({});
	};

	const [correctAnswers, setCorrectAnswers] = useState<Record<string, boolean>>(
		{},
	);

	const handleShowAnswer = () => {
		setCorrectAnswers(
			questions.reduce(
				(acc, question) => ({
					...acc,
					[question.id]: question.isCorrect,
				}),
				{} as Record<string, boolean>,
			),
		);
		setShowExplanations(
			questions.reduce(
				(acc, question) => ({
					...acc,
					[question.id]: true,
				}),
				{} as Record<string, boolean>,
			),
		);
		setShowAnswer(true);
	};
	// const [isShowAns, setIsShowAns] = useState(false);

	return {
		answers,
		showExplanations,
		correctAnswers,
		attempts,
		isCompleted,
		activeHint,
		showHints,
		showTips,
		showAnswer,
		handleAnswer,
		handleReset,
		handleShowAnswer,
		setActiveHint,
		setShowHints,
		setShowTips,
	};
}
