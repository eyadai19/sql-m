"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MultipleChoiceExerciseProps } from "@/lib/types/exerciseTypes";
import ExerciseHeader from "../common/ExerciseHeader";
import TaskPrompt from "../common/TaskPrompt";
import Hints from "../common/Hints";
import QuestionCard from "./QuestionCard";
import ControlButtons from "../common/ControlButtons";

export default function MultipleChoiceExercise({
  title,
  prompt,
  questions,
  difficulty,
  hints = [],
  tips = [],
  onComplete,
}: MultipleChoiceExerciseProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [activeHint, setActiveHint] = useState(-1);
  const [showHints, setShowHints] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswer = (questionId: string, choiceId: string) => {
    if (isCompleted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
    setShowExplanations((prev) => ({
      ...prev,
      [questionId]: true,
    }));
    setAttempts((prev) => prev + 1);

    const updatedAnswers = {
      ...answers,
      [questionId]: choiceId,
    };

    const allCorrect = questions.every(
      (q) => updatedAnswers[q.id] === q.correctChoiceId
    );
    const allAnswered = questions.every((q) => updatedAnswers[q.id]);

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
      [question.id]: question.correctChoiceId,
    }), {});
    setAnswers(correctAnswers);
    setShowExplanations(
      questions.reduce((acc, question) => ({
        ...acc,
        [question.id]: true,
      }), {})
    );
    setShowAnswer(true);
  };

  return (
    <Card className="mx-auto mb-3 w-full max-w-4xl bg-white/40 backdrop-blur-xl my-3">
      <ExerciseHeader
        title={title}
        difficulty={difficulty}
        attempts={attempts}
        isCompleted={isCompleted}
      />

      <CardContent className="space-y-6">
        <TaskPrompt prompt={prompt} />

        <div className="space-y-8">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedAnswer={answers[question.id]}
              onAnswer={(choiceId) => handleAnswer(question.id, choiceId)}
              showExplanation={showExplanations[question.id]}
              isCorrect={answers[question.id] === question.correctChoiceId}
            />
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