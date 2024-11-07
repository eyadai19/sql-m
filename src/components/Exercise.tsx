"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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
	onRunQuery: (query: string) => ResultType | ErrorType;
	answer: string; // Correct SQL answer
	handleShowAnswer: () => void;
	showAnswer: boolean;
};

export default function Exercise({
	title,
	prompt,
	initialColumns,
	initialRows,
	onRunQuery,
	answer,
	showAnswer,
	handleShowAnswer,
}: ExerciseProps) {
	const [sqlQuery, setSqlQuery] = useState<string>("");
	const [result, setResult] = useState<ResultType | null>(null);
	const [error, setError] = useState<ErrorType>(null);
	const [isIncorrectAnswer, setIsIncorrectAnswer] = useState<boolean>(false);

	const handleRunQuery = () => {
		if (sqlQuery !== answer) {
			setIsIncorrectAnswer(true); // Set incorrect answer flag
			setResult(null); // Don't show result
			setError(null); // Clear previous errors
		} else {
			const queryResult = onRunQuery(sqlQuery);
			if (typeof queryResult === "string") {
				setError(queryResult);
				setResult(null); // Don't show result if there's an error
			} else {
				setResult(queryResult);
				setError(null);
			}
			setIsIncorrectAnswer(false); // Correct answer
		}
	};

	const handleShowAnswerClick = () => {
		setSqlQuery(answer); // Set correct answer in text area
		handleShowAnswer(); // Notify parent component that answer is shown
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

				{isIncorrectAnswer && (
					<section className="mt-6">
						<div
							className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
							role="alert"
						>
							<strong className="font-bold">Error: </strong>
							<span className="block sm:inline">Incorrect answer!</span>
						</div>
					</section>
				)}

				{result && (
					<section className="mt-6">
						<h2 className="mb-2 text-lg font-semibold">Results:</h2>
						{error && (
							<div
								className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
								role="alert"
							>
								<strong className="font-bold">Error: </strong>
								<span className="block sm:inline">{error}</span>
							</div>
						)}

						{result && (
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
												className={
													rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
												}
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
						)}
					</section>
				)}
			</CardContent>
		</Card>
	);
}
