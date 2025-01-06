"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseTypes } from "@/lib/types/exerciseTypes";
import { formatTime } from "@/lib/utils";
import { BookOpen, Code } from "lucide-react";
import { useEffect, useState } from "react";
import ControlButtons from "../common/ControlButtons";
import ExerciseHeader from "../common/ExerciseHeader";
import Hints from "../common/Hints";
import TaskPrompt from "../common/TaskPrompt";
import { DragDropContainer } from "./DragDropContainer";
import type {
	DragDropExerciseProps,
	DragDropItem,
	ExerciseState,
} from "./types";

const INITIAL_STATE: ExerciseState = {
	attempts: 0,
	startTime: null,
	elapsedTime: 0,
	isComplete: false,
	score: 0,
	showAnswer: false,
	showHints: true,
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
	UserExcerciseAnswerAction,
}: DragDropExerciseProps) {
	const [currentOrder, setCurrentOrder] = useState<DragDropItem[]>(() =>
		shuffleArray(items),
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
		setCurrentOrder(
			newOrder.map((id) => items.find((item) => item.id === id)!),
		);
	}

	async function handleRun() {
		const isCorrect = correctOrder.every(
			(id, index) => id === currentOrder[index].id,
		);
		const newScore = calculateScore(
			currentOrder.map((item) => item.id),
			correctOrder,
		);

		setState((prev) => ({
			...prev,
			attempts: prev.attempts + 1,
			isComplete: isCorrect,
			score: newScore,
		}));

		if (isCorrect) {
			const inputData = {
				time: state.elapsedTime,
				is_show_ans: state.showAnswer,
				trials: state.attempts + 1,
			};
			try {
				await UserExcerciseAnswerAction(
					inputData,
					null,
					ExerciseTypes.DragDrop,
				);
			} catch (error) {
				console.error("UserExcerciseAnswerAction error:", error);
			}
		}
	}

	function handleReset() {
		setCurrentOrder(shuffleArray(items));
		setState(INITIAL_STATE);
	}

	function handleShowAnswer() {
		const orderedItems = correctOrder.map(
			(id) => items.find((item) => item.id === id)!,
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
		<Card className="mx-auto my-3 w-full max-w-4xl bg-white/40">
			<ExerciseHeader
				title={title}
				difficulty={difficulty}
				attempts={state.attempts}
				isCompleted={state.isComplete}
			/>
			<CardContent className="space-y-6">
				<TaskPrompt prompt={prompt} />

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
						<div className="mb-6">
							<DragDropContainer
								items={currentOrder}
								onReorder={handleReorder}
							/>
						</div>

						<Progress value={state.score} className="h-2" />

						<ControlButtons
							onRun={handleRun}
							onReset={handleReset}
							onShowAnswer={handleShowAnswer}
							showAnswer={state.showAnswer}
						/>
					</TabsContent>
					<TabsContent value="help" className="space-y-6">
						<Hints
							hints={hints}
							activeHint={state.activeHint}
							onNextHint={() =>
								setState((prev) => ({
									...prev,
									activeHint: prev.activeHint + 1,
								}))
							}
							tips={tips}
							showTips={state.showTips}
							onToggleTips={() =>
								setState((prev) => ({ ...prev, showTips: !prev.showTips }))
							}
							showHints={state.showHints}
							onToggleHints={() =>
								setState((prev) => ({ ...prev, showHints: !prev.showHints }))
							}
						/>

						{state.isComplete && (
							<div className="rounded-lg bg-green-50 p-4 text-green-700">
								🎉 Congratulations! You completed the exercise in{" "}
								{state.attempts} attempts and {formatTime(state.elapsedTime)}.
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
