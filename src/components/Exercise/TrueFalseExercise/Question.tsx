"use client";

import { Button } from "@/components/ui/button";
import { TrueFalseQuestion } from "@/lib/types/exerciseTypes";
import { Check, X } from "lucide-react";

interface QuestionProps {
	question: TrueFalseQuestion;
	answer: boolean | null;
	showExplanation: boolean;
	isCompleted: boolean;
	showAnswer: boolean;

	onAnswer: (questionId: string, answer: boolean) => void;
}
export function Question({
	question,
	answer,
	showExplanation,
	isCompleted,
	onAnswer,
	showAnswer,
	correctAnswers,
}: QuestionProps & { correctAnswers: Record<string, boolean> }) {
	return (
		<div
			className={`rounded-lg border p-4 ${
				showAnswer
					? correctAnswers[question.id]
						? "border-green-500"
						: "border-red-500"
					: "border-gray-300"
			} bg-white/30`}
		>
			<div className="flex items-center justify-center gap-4">
				<div className="flex gap-2">
					<Button
						onClick={() => onAnswer(question.id, true)}
						variant={answer === true ? "default" : "outline"}
						disabled={isCompleted}
						className="flex w-8 items-center justify-center text-center"
						size="sm"
					>
						<Check className="h-4 w-4" />
					</Button>
					<Button
						onClick={() => onAnswer(question.id, false)}
						variant={answer === false ? "default" : "outline"}
						disabled={isCompleted}
						className="flex w-8 items-center justify-center"
						size="sm"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
				<p className="flex-1 text-base">{question.statement}</p>
			</div>

			{showExplanation && (
				<div
					className={`mt-4 rounded-lg p-3 text-sm ${
						showAnswer
							? correctAnswers[question.id]
								? "bg-green-50/40 text-green-800"
								: "bg-red-50/40 text-red-800"
							: answer === question.isCorrect
								? "bg-green-50/40 text-green-800"
								: "bg-red-50/40 text-red-800"
					}`}
				>
					{question.explanation}
				</div>
			)}
		</div>
	);
}
