"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, BookOpen } from "lucide-react";
import { QuestionList } from './QuestionList';
import  TaskPrompt  from '../common/TaskPrompt';
import  Hints  from '../common/Hints';
import  ExerciseHeader  from '../common/ExerciseHeader';
import  ControlButtons from '../common/ControlButtons';
import { useExerciseState } from './hooks/useExerciseState';
import { TrueFalseExerciseProps } from '@/lib/types/exerciseTypes';

export default function TrueFalseExercise({
	title,
	prompt,
	questions,
	difficulty,
	hints = [],
	tips = [],
	UserExcerciseAnswerAction,
}: TrueFalseExerciseProps) {
	const {
		answers,
		showExplanations,
		correctAnswers,
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
		setShowTips,
	} = useExerciseState(questions, UserExcerciseAnswerAction);

	return (
		<Card className="mx-auto my-3 mb-3 w-full max-w-4xl bg-white/40 backdrop-blur-xl">
			<ExerciseHeader
				title={title}
				difficulty={difficulty}
				attempts={attempts}
				isCompleted={isCompleted}
			/>

			<CardContent>
				<Tabs defaultValue="exercise" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="exercise" className="flex items-center gap-2">
							<Code className="h-4 w-4" />
							Exercise
						</TabsTrigger>
						<TabsTrigger value="help" className="flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							Help & Tips
						</TabsTrigger>
					</TabsList>

					<TabsContent value="exercise" className="space-y-6">
						<TaskPrompt prompt={prompt} />
						<QuestionList
							questions={questions}
							answers={answers}
							showExplanations={showExplanations}
							isCompleted={isCompleted}
							onAnswer={handleAnswer}
							correctAnswers={correctAnswers}
							showAnswer={showAnswer}
						/>

						<ControlButtons
							onReset={handleReset}
							onShowAnswer={handleShowAnswer}
							showAnswer={showAnswer}
						/>
					</TabsContent>

					<TabsContent value="help" className="space-y-6">
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
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}