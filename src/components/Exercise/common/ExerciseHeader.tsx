"use client";

import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface ExerciseHeaderProps {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  attempts: number;
  isCompleted: boolean;
}

export default function ExerciseHeader({
  title,
  difficulty,
  attempts,
  isCompleted,
}: ExerciseHeaderProps) {
  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  }[difficulty];

  return (
    <CardHeader className="space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold text-sailorBlue">
          {title}
        </CardTitle>
        <Badge className={difficultyColor}>{difficulty}</Badge>
      </div>

      {attempts > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Attempts: {attempts}</span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-green-600">
                <Trophy className="h-4 w-4" />
                Completed
              </span>
            )}
          </div>
          <Progress value={isCompleted ? 100 : Math.min(attempts * 10, 90)} />
        </div>
      )}
    </CardHeader>
  );
}