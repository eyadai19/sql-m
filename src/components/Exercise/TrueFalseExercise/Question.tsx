"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
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
    <div className="border rounded-lg p-4 bg-white/30">
      <div className="flex  gap-4 justify-center items-center">
        <div className="flex  gap-2">
          <Button
            onClick={() => onAnswer(question.id, true)}
            variant={answer === true ? "default" : "outline"}
            disabled={isCompleted}
            className="w-8 flex items-center justify-center text-center"
            size="sm"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onAnswer(question.id, false)}
            variant={answer === false ? "default" : "outline"}
            disabled={isCompleted}
            className="w-8 flex items-center justify-center"
            size="sm"
          >
            <X className=" h-4 w-4" />
          </Button>
        </div>
        <p className="text-lg flex-1">{question.statement}</p>
      </div>

      {showExplanation && (
        <div className={`mt-4 p-3 rounded-lg ${
          answer === question.isCorrect
            ? "bg-green-50/40 text-green-800"
            : "bg-red-50/40 text-red-800"
        }`}>
          {question.explanation}
        </div>
      )}
    </div>
  );
}