"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TrueFalseQuestion } from './types';

interface QuestionProps {
  question: TrueFalseQuestion;
  answer: boolean | null;
  showExplanation: boolean;
  isCompleted: boolean;
  onAnswer: (questionId: string, answer: boolean) => void;
}

export function Question({
  question,
  answer,
  showExplanation,
  isCompleted,
  onAnswer
}: QuestionProps) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start space-x-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`true-${question.id}`}
              checked={answer === true}
              disabled={isCompleted}
              onCheckedChange={() => onAnswer(question.id, true)}
            />
            <Label htmlFor={`true-${question.id}`}>True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`false-${question.id}`}
              checked={answer === false}
              disabled={isCompleted}
              onCheckedChange={() => onAnswer(question.id, false)}
            />
            <Label htmlFor={`false-${question.id}`}>False</Label>
          </div>
        </div>
        <p className="text-lg flex-1">{question.statement}</p>
      </div>

      {showExplanation && (
        <div className={`mt-4 p-3 rounded-lg ${
          answer === question.isCorrect
            ? "bg-green-50 text-green-800"
            : "bg-red-50 text-red-800"
        }`}>
          {question.explanation}
        </div>
      )}
    </div>
  );
}