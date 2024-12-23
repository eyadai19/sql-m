"use client";

import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropExerciseProps } from "@/lib/types/exerciseTypes";
import ExerciseHeader from "../common/ExerciseHeader";
import TaskPrompt from "../common/TaskPrompt";
import Hints from "../common/Hints";
import DroppableList from "./DroppableList";
import ControlButtons from "../common/ControlButtons";

export default function DragDropExercise({
  title,
  prompt,
  items,
  correctOrder,
  difficulty,
  hints = [],
  tips = [],
  onComplete,
}: DragDropExerciseProps) {
  const [dragItems, setDragItems] = useState(items);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [activeHint, setActiveHint] = useState(-1);
  const [showHints, setShowHints] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const checkOrder = () => {
    setAttempts((prev) => prev + 1);
    const currentOrder = dragItems.map((item) => item.id);
    const correct = currentOrder.every((id, index) => id === correctOrder[index]);

    if (correct && !isCorrect) {
      setIsCorrect(true);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete({ time: timeSpent, trials: attempts + 1 });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(dragItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDragItems(items);
    checkOrder();
  };

  const handleReset = () => {
    setDragItems(items);
    setShowAnswer(false);
    setActiveHint(-1);
    setShowHints(false);
  };

  const handleShowAnswer = () => {
    const orderedItems = correctOrder.map(id => 
      items.find(item => item.id === id)!
    );
    setDragItems(orderedItems);
    setShowAnswer(true);
  };

  return (
    <Card className="mx-auto mb-3 w-full max-w-6xl bg-white/40 backdrop-blur-xl ">
      <ExerciseHeader
        title={title}
        difficulty={difficulty}
        attempts={attempts}
        isCompleted={isCorrect}
      />

      <CardContent className="space-y-6">
        <TaskPrompt prompt={prompt} />

        <DragDropContext onDragEnd={handleDragEnd}>
          <DroppableList items={dragItems} />
        </DragDropContext>

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