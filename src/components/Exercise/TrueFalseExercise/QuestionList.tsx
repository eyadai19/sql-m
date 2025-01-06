"use client";

import { TrueFalseQuestion } from '@/lib/types/exerciseTypes';
import { Question } from './Question';

interface QuestionListProps {
	questions: TrueFalseQuestion[];
	answers: Record<string, boolean | null>;
	showExplanations: Record<string, boolean>;
	isCompleted: boolean;
	showAnswer: boolean;
	onAnswer: (questionId: string, answer: boolean) => void;
}
export function QuestionList({
	questions,
	answers,
	showExplanations,
	isCompleted,
	onAnswer,
	showAnswer,
	correctAnswers,
}: QuestionListProps & { correctAnswers: Record<string, boolean> }) {
	return (
		<div className="space-y-4">
			{questions.map((question) => (
				<Question
					showAnswer={showAnswer}
					key={question.id}
					question={question}
					answer={answers[question.id]}
					showExplanation={showExplanations[question.id]}
					isCompleted={isCompleted}
					onAnswer={onAnswer}
					correctAnswers={correctAnswers}
				/>
			))}
		</div>
	);
}
