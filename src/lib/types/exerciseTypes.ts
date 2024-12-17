export interface BaseExerciseProps {
    title: string;
    prompt: string;
    difficulty: "Easy" | "Medium" | "Hard";
    hints?: string[];
    tips?: string[];
    onComplete: (data: { time: number; trials: number }) => void;
  }
  
  // Drag and Drop Exercise Types
  export interface DragDropItem {
    id: string;
    content: string;
  }
  
  export interface DragDropExerciseProps extends BaseExerciseProps {
    items: DragDropItem[];
    correctOrder: string[];
  }
  
  // True/False Exercise Types
  export interface TrueFalseQuestion {
    id: string;
    statement: string;
    isCorrect: boolean;
    explanation: string;
  }
  
  export interface TrueFalseExerciseProps extends BaseExerciseProps {
    questions: TrueFalseQuestion[];
  }
  
  // Multiple Choice Exercise Types
  export interface Choice {
    id: string;
    text: string;
    imageUrl?: string;
  }
  
  export interface Question {
    id: string;
    question: string;
    imageUrl?: string;
    choices: Choice[];
    correctChoiceId: string;
    explanation: string;
  }
  
  export interface MultipleChoiceExerciseProps extends BaseExerciseProps {
    questions: Question[];
  }