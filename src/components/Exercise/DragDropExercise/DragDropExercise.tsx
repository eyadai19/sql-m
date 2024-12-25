'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { DragDropContainer } from './DragDropContainer';
import  ExerciseHeader  from '../common/ExerciseHeader';
import  TaskPrompt  from '../common/TaskPrompt';
import  Hints  from '../common/Hints';
import  ControlButtons  from '../common/ControlButtons';
import { formatTime } from '@/lib/utils';
import type { DragDropExerciseProps, ExerciseState, DragDropItem } from './types';

const INITIAL_STATE: ExerciseState = {
  attempts: 0,
  startTime: null,
  elapsedTime: 0,
  isComplete: false,
  score: 0,
  showAnswer: false,
  showHints: false,
  showTips: false,
  activeHint: 0,
};

export default function DragDropExercise({
  title,
  prompt,
  items,
  mode,
  headings,
  correctOrder,
  difficulty,
  hints = [],
  tips = [],
  onComplete,
}: DragDropExerciseProps) {
  const [currentOrder, setCurrentOrder] = useState<DragDropItem[]>(() =>
    shuffleArray(items)
  );
  const [state, setState] = useState<ExerciseState>(INITIAL_STATE);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.startTime && !state.isComplete) {
      timer = setInterval(() => {
        setState((prev) => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - prev.startTime!) / 1000),
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.startTime, state.isComplete]);

  function handleReorder(newOrder: string[]) {
    if (!state.startTime) {
      setState((prev) => ({ ...prev, startTime: Date.now() }));
    }
    setCurrentOrder(newOrder.map(id => items.find(item => item.id === id)!));
  }

  function handleRun() {
    const isCorrect = correctOrder.every((id, index) => id === currentOrder[index].id);
    const newScore = calculateScore(currentOrder.map(item => item.id), correctOrder);

    setState((prev) => ({
      ...prev,
      attempts: prev.attempts + 1,
      isComplete: isCorrect,
      score: newScore,
    }));

    if (isCorrect) {
      onComplete({
        time: state.elapsedTime,
        trials: state.attempts + 1,
      });
    }
  }

  function handleReset() {
    setCurrentOrder(shuffleArray(items));
    setState(INITIAL_STATE);
  }

  function handleShowAnswer() {
    const orderedItems = correctOrder.map(id => 
      items.find(item => item.id === id)!
    );
    setCurrentOrder(orderedItems);
    setState((prev) => ({ ...prev, showAnswer: true }));
  }


function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function calculateScore(current: string[], correct: string[]): number {
  let matches = 0;
  for (let i = 0; i < correct.length; i++) {
    if (current[i] === correct[i]) matches++;
  }
  return Math.round((matches / correct.length) * 100);
}

  return (
    <Card className="mx-auto p-6 w-full max-w-4xl bg-white/40 ">
      <ExerciseHeader
        title={title}
        difficulty={difficulty}
        attempts={state.attempts}
        isCompleted={state.isComplete}
      />
      
      <TaskPrompt prompt={prompt} />

      <div className="mb-6">
        <DragDropContainer
          items={currentOrder}
          onReorder={handleReorder}
        />
      </div>

      <div className="space-y-4">
        <Progress value={state.score} className="h-2" />

        <ControlButtons
          onRun={handleRun}
          onReset={handleReset}
          onShowAnswer={handleShowAnswer}
          showAnswer={state.showAnswer}
        />

        <Hints
          hints={hints}
          activeHint={state.activeHint}
          onNextHint={() => setState(prev => ({ ...prev, activeHint: prev.activeHint + 1 }))}
          tips={tips}
          showTips={state.showTips}
          onToggleTips={() => setState(prev => ({ ...prev, showTips: !prev.showTips }))}
          showHints={state.showHints}
          onToggleHints={() => setState(prev => ({ ...prev, showHints: !prev.showHints }))}
        />

        {state.isComplete && (
          <div className="rounded-lg bg-green-50 p-4 text-green-700">
            🎉 Congratulations! You completed the exercise in {state.attempts}{' '}
            attempts and {formatTime(state.elapsedTime)}.
          </div>
        )}
      </div>
    </Card>
  );
}
