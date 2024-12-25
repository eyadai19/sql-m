export interface TrueFalseQuestion {
    id: string;
    statement: string;
    isCorrect: boolean;
    explanation: string;
  }
  
  export interface TrueFalseExerciseProps {
    title: string;
    prompt: string;
    questions: TrueFalseQuestion[];
    difficulty: "Easy" | "Medium" | "Hard";
    hints?: string[];
    tips?: string[];
    onComplete: (data: { time: number; trials: number }) => void;
  }