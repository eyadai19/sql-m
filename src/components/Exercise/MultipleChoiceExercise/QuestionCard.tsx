"use client";

import Image from "next/image";
import { Question } from "@/lib/types/exerciseTypes";
import ChoiceButton from "./ChoiceButton";

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswer: (choiceId: string) => void;
  showExplanation: boolean;
  isCorrect: boolean;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  showExplanation,
  isCorrect,
}: QuestionCardProps) {
  return (
    <div className="border rounded-lg p-6 bg-white/30">
      <div className="space-y-4">
        <p className="text-sm font-medium">{question.question}</p>

        {question.imageUrl && (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={question.imageUrl}
              alt="Question illustration"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              isSelected={selectedAnswer === choice.id}
              onClick={() => onAnswer(choice.id)}
            />
          ))}
        </div>

        {showExplanation && (
          <div
            className={`mt-4 p-4 rounded-lg text-sm ${
              isCorrect
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {question.explanation}
          </div>
        )}
      </div>
    </div>
  );
}