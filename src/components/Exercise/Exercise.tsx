"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { QueryResult } from "@/lib/types/mockDatabase";
import {
	userExcerciseAnswerError,
	userExcerciseAnswerSchema,
} from "@/lib/types/userSchema";
import { AlertCircle, BookOpen, Code, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import ControlButtons from "./ControlButtons";
import Hints from "./Hints";
import ResultsView from "./ResultsView";
import SQLEditor from "./SQLEditor";
import TablesView from "./TablesView";
import TaskPrompt from "./TaskPrompt";

export type ResultType = QueryResult | null;
export type ErrorType = string | null;

export interface ExerciseProps {
	title?: string;
	prompt: string;
	tips?: string[];
	tables: string[];
	difficulty: "Easy" | "Medium" | "Hard";
	reference?: string;
	answer?: string;
	hints?: string[];
	seed?: string;
	expectedRowCount?: number;
	UserExcerciseAnswerAction: (
		input: z.infer<typeof userExcerciseAnswerSchema>,
	) => Promise<userExcerciseAnswerError | undefined>;
}

export default function Exercise({
	title = "SQL Exercise",
	prompt,
	tables,
	answer,
	difficulty,
	tips = [],
	hints = [],
	seed = uuidv4(),
	expectedRowCount,
	UserExcerciseAnswerAction,
}: ExerciseProps) {
	const [sqlQuery, setSqlQuery] = useState<string>("");
	const [showAnswer, setShowAnswer] = useState(false);
	const [result, setResult] = useState<ResultType>(null);
	const [error, setError] = useState<ErrorType>(null);
	const [isCorrect, setIsCorrect] = useState(false);
	const [attempts, setAttempts] = useState(0);
	const exerciseStartTime = useRef<number | null>(null);

	// Initialize start time on first attempt
	useEffect(() => {
		if (attempts === 1 && exerciseStartTime.current === null) {
			exerciseStartTime.current = performance.now();
		}
	}, [attempts]);

	const difficultyColor = {
		Easy: "bg-green-100 text-green-800",
		Medium: "bg-yellow-100 text-yellow-800",
		Hard: "bg-red-100 text-red-800",
	}[difficulty];

	const handleRunQuery = async () => {
		if (!sqlQuery.trim()) {
			setError("Please enter a SQL query");
			return;
		}

		try {
			setError(null);
			setResult(null);
			setAttempts((prev) => prev + 1);

			const response = await fetch("/api/validate-query", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: sqlQuery,
					seed,
					employeesCount: 8,
					departmentsCount: 4,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				setError(data.error);
				return;
			}

			const data = await response.json();

			const queryResult: QueryResult = {
				...data,
				successMessage: undefined,
			};

			// Validate if result matches expected criteria
			const isResultCorrect = expectedRowCount
				? data.rows.length === expectedRowCount
				: true;

			setIsCorrect(isResultCorrect);

			if (isResultCorrect) {
				// Calculate total elapsed time
				const endTime = performance.now();
				const elapsedTime =
					exerciseStartTime.current !== null
						? Math.round((endTime - exerciseStartTime.current) / 1000)
						: 0;

				// Call UserExcerciseAnswerAction with the required data
				const inputData = {
					time: elapsedTime,
					is_show_ans: showAnswer,
					trials: attempts, // Total incorrect attempts
				};
				await UserExcerciseAnswerAction(inputData);

				queryResult.successMessage =
					attempts === 1
						? "Excellent! You solved it on your first try!"
						: `Great job! You solved it in ${attempts} attempts.`;
			}

			setResult(queryResult);
		} catch (err) {
			console.error("Query execution error:", err);
			setError("An error occurred while executing the query");
		}
	};

	const handleReset = () => {
		setSqlQuery("");
		setError(null);
		setResult(null);
		setIsCorrect(false);
		setShowAnswer(false);
		setAttempts(0); // Reset attempts
		exerciseStartTime.current = null; // Reset start time
	};

	return (
		<Card className="mx-auto mb-3 w-full max-w-4xl bg-white/40 backdrop-blur-xl">
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
							{isCorrect && (
								<span className="flex items-center gap-1 text-green-600">
									<Trophy className="h-4 w-4" />
									Completed
								</span>
							)}
						</div>
						<Progress value={isCorrect ? 100 : Math.min(attempts * 10, 90)} />
					</div>
				)}
			</CardHeader>

			<CardContent className="space-y-6">
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
						<TablesView tables={tables} seed={seed} />
						<SQLEditor
							value={sqlQuery}
							onChange={setSqlQuery}
							onExecute={handleRunQuery}
						/>
						<ControlButtons
							onRun={handleRunQuery}
							onReset={handleReset}
							onShowAnswer={() => {
								setSqlQuery(answer || "");
								setShowAnswer(true);
							}}
							showAnswer={showAnswer}
						/>
						{error && (
							<Alert variant="destructive">
								<div className="flex items-center">
									<AlertCircle className="mr-3 h-4 w-4" />
									<AlertDescription>{error}</AlertDescription>
								</div>
							</Alert>
						)}

						{result && <ResultsView result={result} />}
					</TabsContent>

					<TabsContent value="help" className="space-y-6">
						<Hints
							hints={hints}
							activeHint={0}
							onNextHint={() => {}}
							tips={tips}
							showTips={false}
							onToggleTips={() => {}}
						/>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
