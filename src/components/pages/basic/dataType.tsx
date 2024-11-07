"use client";
import Exercise from "@/components/Exercise";
import {
	userExcerciseAnswerError,
	userExcerciseAnswerSchema,
	userExcerciseAnswerSchemaForInput,
} from "@/lib/types/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function DataType({
	userExcerciseAnswerAction,
}: {
	userExcerciseAnswerAction: (
		input: z.infer<typeof userExcerciseAnswerSchema>,
	) => Promise<userExcerciseAnswerError | undefined>;
}) {
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [trials, setTrials] = useState(1); // Track number of trials
	const [showAnswer, setShowAnswer] = useState(false); // Flag for showing answer

	useEffect(() => {
		setStartTime(new Date()); // Start timer when component is loaded
	}, []);

	const form = useForm<z.infer<typeof userExcerciseAnswerSchemaForInput>>({
		resolver: zodResolver(userExcerciseAnswerSchemaForInput),
		defaultValues: {
			is_show_ans: false,
		},
	});

	// Submit the form with trial count and time elapsed
	async function onSubmit() {
		const endTime = new Date();
		const timeElapsed =
			endTime.getTime() - (startTime?.getTime() || endTime.getTime());

		const newValue: z.infer<typeof userExcerciseAnswerSchema> = {
			trials: trials,
			is_show_ans: showAnswer,
			time: timeElapsed,
		};

		const error = await userExcerciseAnswerAction(newValue);

		// Only update trials if there's an error (wrong answer)
		if (error) {
			setTrials((prevTrials) => prevTrials + 1); // Increment trials
		}
	}

	const handleShowAnswer = () => {
		setShowAnswer(true); // Set flag to show answer
	};

	return (
		<Exercise
			title="SQL Exercise: Select Query"
			prompt="Write a SQL query to retrieve all employees from the employees table with a salary greater than $50,000. Make sure to include the columns: id, name, and salary."
			initialColumns={["id", "name", "salary"]}
			initialRows={[
				[1, "John Doe", 60000],
				[2, "Jane Smith", 75000],
				[3, "Alice Johnson", 80000],
			]}
			onRunQuery={(query) => {
				// Check if the query is correct
				if (
					query.toLowerCase() ===
					"SELECT * FROM employees WHERE salary > 50000".toLowerCase()
				) {
					onSubmit(); // Submit if correct query
					return {
						columns: ["id", "name", "salary"],
						rows: [
							[1, "John Doe", 60000],
							[2, "Jane Smith", 75000],
							[3, "Alice Johnson", 80000],
						],
					};
				} else {
					// Return error message if query is incorrect
					return "Syntax error in SQL query.";
				}
			}}
			answer="SELECT * FROM employees WHERE salary > 50000" // Correct query
			showAnswer={showAnswer} // Pass state to Exercise component
			handleShowAnswer={handleShowAnswer} // Handler to show answer
		/>
	);
}
