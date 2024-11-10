"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	userExcerciseAnswerError,
	userExcerciseAnswerSchema,
} from "@/lib/types/userSchema";
import { useEffect, useState } from "react";
import { z } from "zod";

type ResultType = {
	columns: string[];
	rows: (string | number)[][];
} | null;

type ErrorType = string | null;

type ExerciseProps = {
	title: string;
	prompt: string;
	initialColumns: string[];
	initialRows: (string | number)[][];
	answer: string;
	userExcerciseAnswerAction: (
		input: z.infer<typeof userExcerciseAnswerSchema>,
	) => Promise<userExcerciseAnswerError | undefined>;
};

export default function Exercise({
	title,
	prompt,
	initialColumns,
	initialRows,
	answer,
	userExcerciseAnswerAction,
}: ExerciseProps) {
	const [sqlQuery, setSqlQuery] = useState<string>("");
	const [result, setResult] = useState<ResultType | null>(null);
	const [error, setError] = useState<ErrorType>(null);
	const [isIncorrectAnswer, setIsIncorrectAnswer] = useState<boolean>(false);

	// Track time and trials
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [trials, setTrials] = useState(1);
	const [showAnswer, setShowAnswer] = useState(false);

	useEffect(() => {
		setStartTime(new Date()); // Start timer on component load
	}, []);

	// Submit function to handle time and trial count
	async function onSubmit() {
		const endTime = new Date();
		const timeElapsed =
			endTime.getTime() - (startTime?.getTime() || endTime.getTime());

		const submissionData = {
			trials: trials,
			is_show_ans: showAnswer,
			time: timeElapsed,
		};

		const error = await userExcerciseAnswerAction(submissionData);
		setTrials((prevTrials) => prevTrials + 1); // Increment trials if there’s an error
		//if (error) setTrials((prevTrials) => prevTrials + 1); // Increment trials if there’s an error
	}

	const handleRunQuery = () => {
		if (sqlQuery !== answer) {
			setIsIncorrectAnswer(true);
			setResult(null);
			setError("Incorrect answer!");
		} else {
			setError(null);
			onSubmit(); // Submit only if the answer is correct
			setIsIncorrectAnswer(false);
			setResult({
				columns: initialColumns,
				rows: initialRows,
			});
		}
	};

	const handleShowAnswerClick = () => {
		setSqlQuery(answer);
		setShowAnswer(true); // Set the flag to show answer
	};

	return (
		<Card className="mx-auto w-full max-w-4xl">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<section className="rounded-lg bg-gray-50 p-4">
					<h2 className="mb-2 text-lg font-semibold">Task:</h2>
					<p className="text-gray-700">{prompt}</p>
				</section>

				<section>
					<Label
						htmlFor="sql-editor"
						className="mb-2 block text-lg font-semibold"
					>
						SQL Editor
					</Label>
					<textarea
						id="sql-editor"
						className="h-40 w-full rounded-md border border-gray-300 bg-gray-100 p-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
						value={sqlQuery}
						onChange={(e) => setSqlQuery(e.target.value)}
						placeholder="Type your SQL query here..."
					/>
				</section>

				<section className="flex justify-between">
					<Button
						onClick={handleRunQuery}
						className="bg-blue-500 text-white hover:bg-blue-600"
					>
						Run Query
					</Button>

					<Button
						variant="secondary"
						className="bg-green-500 text-white hover:bg-green-600"
						onClick={handleShowAnswerClick}
						type="button"
					>
						Show Answer
					</Button>
				</section>

				{isIncorrectAnswer && error && (
					<section className="mt-6">
						<div
							className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
							role="alert"
						>
							<strong className="font-bold">Error: </strong>
							<span className="block sm:inline">{error}</span>
						</div>
					</section>
				)}

				{result && (
					<section className="mt-6">
						<h2 className="mb-2 text-lg font-semibold">Results:</h2>
						<div className="overflow-x-auto">
							<table className="min-w-full border border-gray-300 bg-white">
								<thead>
									<tr className="bg-gray-100">
										{result.columns.map((column, index) => (
											<th
												key={index}
												className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
											>
												{column}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{result.rows.map((row, rowIndex) => (
										<tr
											key={rowIndex}
											className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
										>
											{row.map((cell, cellIndex) => (
												<td
													key={cellIndex}
													className="border-t border-gray-300 px-4 py-2 text-sm text-gray-700"
												>
													{cell}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>
				)}
			</CardContent>
		</Card>
	);
}
