import { z } from "zod";
import {
	userExcerciseAnswerError,
	userExcerciseAnswerSchema,
} from "./userSchema";

// Base Types
export interface BaseExerciseProps {
	title: string;
	prompt: string;
	difficulty: "Easy" | "Medium" | "Hard";
	hints?: string[];
	tips?: string[];
	UserExcerciseAnswerAction: (
		input: z.infer<typeof userExcerciseAnswerSchema>,
		score: number | null,
		type: string,
	) => Promise<userExcerciseAnswerError | undefined>;
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

export const ExerciseTypes = {
	DragDrop: "DragDropExercise" as const,
	MultipleChoice: "MultipleChoiceExercise" as const,
	TrueFalse: "TrueFalseExercise" as const,
	Normal: "NormalExercise" as const,
};

export interface Question {
	// type: typeof ExerciseTypes.Normal;
	type: string;
	question: string;
}

export interface MCQ extends Question {
	// type: typeof ExerciseTypes.MultipleChoice;
	type: string;
	options: string[];
}

export interface DragDrop extends Question {
	// type: typeof ExerciseTypes.DragDrop;
	type: string;
	options: string[];
}

export interface TrueFalse extends Question {
	// type: typeof ExerciseTypes.TrueFalse;
	type: string;
	correctAnswer: boolean;
}

export type QuizInput = (
	| {
			question: string;
			answer: string;
			type: "NormalExercise" | "TrueFalseExercise";
	  }
	| {
			question: string;
			type: "MultipleChoiceExercise";
			options: string[];
			answer: string;
	  }
	| {
			question: string;
			type: "DragDropExercise";
			options: string[];
			order: string[];
	  }
)[];
