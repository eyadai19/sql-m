"use client";

import { useState } from 'react';
import type { TrueFalseQuestion } from '../types';

export function useExerciseState(
  questions: TrueFalseQuestion[],
  onComplete: (data: { time: number; trials: number }) => void
) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [activeHint, setActiveHint] = useState(0);
  const [showHints, setShowHints] = useState(true);
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

    checkCompletion(updatedAnswers);
  };

  const checkCompletion = (currentAnswers: Record<string, boolean | null>) => {
    const allCorrect = questions.every(q => currentAnswers[q.id] === q.isCorrect);
    const allAnswered = questions.every(q => 
      currentAnswers[q.id] !== null && currentAnswers[q.id] !== undefined
    );

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

  return {
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
  };
}