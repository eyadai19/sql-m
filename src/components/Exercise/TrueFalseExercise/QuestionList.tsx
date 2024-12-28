"use client";

import { Question } from './Question';
import type { TrueFalseQuestion } from './types';

interface QuestionListProps {
  questions: TrueFalseQuestion[];
  answers: Record<string, boolean | null>;
  showExplanations: Record<string, boolean>;
  isCompleted: boolean;
  onAnswer: (questionId: string, answer: boolean) => void;
}

export function QuestionList({
  questions,
  answers,
  showExplanations,
  isCompleted,
  onAnswer
}: QuestionListProps) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Question
          key={question.id}
          question={question}
          answer={answers[question.id]}
          showExplanation={showExplanations[question.id]}
          isCompleted={isCompleted}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
}