import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Eye } from "lucide-react";

interface ControlButtonsProps {
  onRun: () => void;
  onReset: () => void;
  onShowAnswer: () => void;
  showAnswer: boolean;
}

export default function ControlButtons({
  onRun,
  onReset,
  onShowAnswer,
  showAnswer
}: ControlButtonsProps) {
  return (
    <section className="flex justify-between">
      <div className="space-x-2">
        <Button
          onClick={onRun}
          className="bg-sailorBlue hover:bg-lightSailorBlue text-gray-200"
        >
          <Play className="mr-2 h-4 w-4" />
          Run Query
        </Button>
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