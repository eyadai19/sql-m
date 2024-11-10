"use client";

import { UserExcerciseAnswerAction } from "@/lib/ServerAction/userExcerciseAnswerAction";
import Exercise from "../../Exercise";
import Explanation from "../../Explanation";

export default function SelectPage() {
	const explanationParams = {
		howItWorks:
			"The SELECT statement is a fundamental SQL query used to retrieve specific data from one or more tables in a database.",
		syntax: `SELECT column1, column2, ...
		FROM table_name;`,
		example: {
			code: `SELECT * FROM customers;`,
			explanation:
				"This query retrieves all columns and rows from the 'customers' table.",
		},
		notes: [
			"The asterisk (*) is a wildcard that selects all columns.",
			"You can specify specific columns to retrieve by listing them after SELECT.",
			"To filter results, use the WHERE clause.",
			"To sort results, use the ORDER BY clause.",
			"To limit the number of rows returned, use the LIMIT clause.",
		],
	};
	return (
		<div>
			<Explanation {...explanationParams} />

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
		</div>
	);
}
