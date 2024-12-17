"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import TaskPrompt from "./common/TaskPrompt";
import Hints from "./common/Hints";
import ExerciseHeader from "./common/ExerciseHeader";
import ControlButtons from "./common/ControlButtons";

interface TrueFalseQuestion {
  id: string;
  statement: string;
  isCorrect: boolean;
  explanation: string;
}

interface TrueFalseExerciseProps {
  title: string;
  prompt: string;
  questions: TrueFalseQuestion[];
  difficulty: "Easy" | "Medium" | "Hard";
  hints?: string[];
  tips?: string[];
  onComplete: (data: { time: number; trials: number }) => void;
}

export default function TrueFalseExercise({
  title,
  prompt,
  questions,
  difficulty,
  hints = [],
  tips = [],
  onComplete
}: TrueFalseExerciseProps) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [activeHint, setActiveHint] = useState(-1);
  const [showHints, setShowHints] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswer = (questionId: string, answer: boolean) => {
    if (isCompleted) return;

    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: true
    }));
    setAttempts(prev => prev + 1);

    const updatedAnswers = {
      ...answers,
      [questionId]: answer
    };

    const allCorrect = questions.every(q => updatedAnswers[q.id] === q.isCorrect);
    const allAnswered = questions.every(q => updatedAnswers[q.id] !== null && updatedAnswers[q.id] !== undefined);

    if (allCorrect && allAnswered && !isCompleted) {
      setIsCompleted(true);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete({ time: timeSpent, trials: attempts + 1 });
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
  };

  const handleShowAnswer = () => {
    const correctAnswers = questions.reduce((acc, question) => ({
      ...acc,
      [question.id]: question.isCorrect
    }), {} as Record<string, boolean>);
    setAnswers(correctAnswers);
    setShowExplanations(
      questions.reduce((acc, question) => ({
        ...acc,
        [question.id]: true
      }), {} as Record<string, boolean>)
    );
    setShowAnswer(true);
  };

  return (
    <Card className="mx-auto mb-3 w-full max-w-4xl bg-white/40 backdrop-blur-xl">
      <ExerciseHeader
        title={title}
        difficulty={difficulty}
        attempts={attempts}
        isCompleted={isCompleted}
      />

      <CardContent className="space-y-6">
        <TaskPrompt prompt={prompt} />

        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border rounded-lg p-4 bg-white">
              <p className="mb-4 text-lg">{question.statement}</p>
              
              <div className="flex gap-4 mb-4">
                <Button
                  onClick={() => handleAnswer(question.id, true)}
                  variant={answers[question.id] === true ? "default" : "outline"}
                  className="w-24"
                >
                  <Check className="mr-2 h-4 w-4" />
                  True
                </Button>
                <Button
                  onClick={() => handleAnswer(question.id, false)}
                  variant={answers[question.id] === false ? "default" : "outline"}
                  className="w-24"
                >
                  <X className="mr-2 h-4 w-4" />
                  False
                </Button>
              </div>

              {showExplanations[question.id] && (
                <div className={`p-3 rounded-lg ${
                  answers[question.id] === question.isCorrect
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}>
                  {question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <ControlButtons
          onReset={handleReset}
          onShowAnswer={handleShowAnswer}
          showAnswer={showAnswer}
        />

        <Hints
          hints={hints}
          activeHint={activeHint}
          onNextHint={() => setActiveHint((prev) => prev + 1)}
          tips={tips}
          showTips={showTips}
          onToggleTips={() => setShowTips((prev) => !prev)}
          showHints={showHints}
          onToggleHints={() => setShowHints((prev) => !prev)}
        />
      </CardContent>
    </Card>
  );
}