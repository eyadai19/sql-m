// Base Types
export interface BaseExerciseProps {
	title: string;
	prompt: string;
	difficulty: "Easy" | "Medium" | "Hard";
	hints?: string[];
	tips?: string[];
	onComplete?: (data: { time: number; trials: number }) => void;
}

// Common Types
export interface ExerciseState {
	attempts: number;
	startTime: number | null;
	elapsedTime: number;
	isComplete: boolean;
	score: number;
	showAnswer: boolean;
	showHints: boolean;
	showTips: boolean;
	activeHint: number;
}

// Drag and Drop Types
export interface DragDropItem {
	id: string;
	content: string;
}

export interface DragDropHeading {
	id: string;
	title: string;
}

export interface DragDropExerciseProps extends BaseExerciseProps {
	items: DragDropItem[];
	mode: "simple" | "categorized";
	headings?: DragDropHeading[];
	correctOrder: string[];
}

export interface DragDropContainerProps {
	items: DragDropItem[];
	onReorder: (newOrder: string[]) => void;
}

// True/False Types
export interface TrueFalseQuestion {
	id: string;
	statement: string;
	isCorrect: boolean;
	explanation: string;
}

export interface TrueFalseExerciseProps extends BaseExerciseProps {
	questions: TrueFalseQuestion[];
}

// Multiple Choice Types
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
