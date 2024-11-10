"use client";
import Exercise from "@/components/Exercise";
import { UserExcerciseAnswerAction } from "@/lib/ServerAction/userExcerciseAnswerAction";

export function DataType() {
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
			answer="SELECT * FROM employees WHERE salary > 50000"
			userExcerciseAnswerAction={UserExcerciseAnswerAction} // Pass the action to Exercise
		/>
	);
}
