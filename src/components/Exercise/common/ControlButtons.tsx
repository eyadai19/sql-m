"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw, Eye } from "lucide-react";

interface ControlButtonsProps {
  onRun?: () => void;
  onReset: () => void;
  onShowAnswer: () => void;
  showAnswer: boolean;
}

export default function ControlButtons({
  onRun,
  onReset,
  onShowAnswer,
  showAnswer,
}: ControlButtonsProps) {
  return (
    <section className="flex justify-between">
      <div className="space-x-2">
        {onRun && (
          <Button
            onClick={onRun}
            className="bg-sailorBlue hover:bg-lightSailorBlue text-gray-200"
          >
            Run Query
          </Button>
        )}
        <Button
          onClick={onReset}
          variant="outline"
          className="border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      <Button
        variant="outline"
        className="border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100"
        onClick={onShowAnswer}
        disabled={showAnswer}
      >
        <Eye className="mr-2 h-4 w-4" />
        Show Answer
      </Button>
    </section>
  );
}