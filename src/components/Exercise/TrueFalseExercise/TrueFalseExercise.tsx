"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QuestionList } from './QuestionList';
import  TaskPrompt  from '../common/TaskPrompt';
import  Hints  from '../common/Hints';
import  ExerciseHeader from '../common/ExerciseHeader';
import  ControlButtons  from '../common/ControlButtons';
import { useExerciseState } from './hooks/useExerciseState';
import type { TrueFalseExerciseProps } from './types';

export default function TrueFalseExercise({
  title,
  prompt,
  questions,
  difficulty,
  hints = [],
  tips = [],
  onComplete
}: TrueFalseExerciseProps) {
  const {
    answers,
    showExplanations,
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
    setShowTips
  } = useExerciseState(questions, onComplete);

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

        <QuestionList
          questions={questions}
          answers={answers}
          showExplanations={showExplanations}
          isCompleted={isCompleted}
          onAnswer={handleAnswer}
        />

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