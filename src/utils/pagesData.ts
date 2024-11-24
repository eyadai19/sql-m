interface ExplanationParams {
	title?: string;
	howItWorks: string;
	syntax: string;
	example: {
		code: string;
		explanation: string;
		liveDemo?: React.ReactNode;
	};
	notes: string[];
	additionalResources?: {
		title: string;
		url: string;
	}[];
	difficulty?: "Beginner" | "Intermediate" | "Advanced";
	tags?: string[];
}

interface ExerciseParams {
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
}

interface PageParams {
	exerciseParams: ExerciseParams;
	explanationParams: ExplanationParams;
}

interface PageData {
	select: PageParams;
	insert: PageParams;
	update: PageParams;
	delete: PageParams;
}

const PAGE_DATA: PageData = {
	select: {
		exerciseParams: {
			title: "Employee Information Query",
			prompt:
				"Write a query to retrieve all employees who earn more than $60,000 and work in the Engineering department (department_id = 1).",
			tables: ["employees", "departments"],
			difficulty: "Easy",
			hints: [
				"Start by thinking about which table contains salary information",
				"Consider how to filter records based on multiple conditions",
				"Use the AND operator to combine conditions",
			],
			tips: [
				"Always specify the columns you need rather than using SELECT *",
				"Use meaningful table aliases for better readability",
				"Consider the order of your WHERE conditions",
			],
			answer: `SELECT e.name, e.position, e.salary 
FROM employees e 
WHERE e.salary > 60000 
AND e.department_id = 1;`,
			seed: "seed1",
			expectedRowCount: 3,
		},
		explanationParams: {
			title: "Understanding SELECT Statements",
			howItWorks:
				"The SELECT statement is used to retrieve specific data from one or more database tables. It allows you to specify exactly which columns you want to see and filter the results based on certain conditions.",
			syntax: `SELECT column1, column2, ... 
FROM table_name 
WHERE condition1 AND condition2;`,
			example: {
				code: `SELECT id, name, salary 
FROM employees 
WHERE salary > 50000 
AND department_id = 2;`,
				explanation:
					"This query retrieves the ID, name, and salary of employees who earn more than $50,000 and work in department 2.",
			},
			notes: [
				"The WHERE clause filters rows based on specified conditions",
				"Multiple conditions can be combined using AND/OR operators",
				"Column names should match exactly as they are defined in the database schema",
				"Use meaningful aliases to improve query readability",
				"Always consider indexing for frequently queried columns",
			],
			additionalResources: [
				{
					title: "W3Schools SQL SELECT Statement",
					url: "https://www.w3schools.com/sql/sql_select.asp",
				},
				{
					title: "PostgreSQL SELECT Documentation",
					url: "https://www.postgresql.org/docs/current/sql-select.html",
				},
			],
			difficulty: "Beginner",
			tags: [
				"SELECT",
				"WHERE",
				"Filtering",
				"Basic Queries",
				"SQL Fundamentals",
			],
		},
	},
	insert: {
		exerciseParams: {
			title: "New Employee Registration",
			prompt:
				"Write a query to insert a new employee into the employees table with the following details: name='John Smith', position='Software Engineer', salary=75000, department_id=1.",
			tables: ["employees"],
			difficulty: "Easy",
			hints: [
				"Remember to specify both column names and values",
				"Match the data types of the values with their respective columns",
				"Consider which fields are required and which are optional",
			],
			tips: [
				"Always list columns explicitly in your INSERT statement",
				"Use appropriate data types for values",
				"Consider constraints before inserting data",
			],
			answer: `INSERT INTO employees (name, position, salary, department_id)
VALUES ('John Smith', 'Software Engineer', 75000, 1);`,
			seed: "seed2",
			expectedRowCount: 1,
		},
		explanationParams: {
			title: "Mastering INSERT Statements",
			howItWorks:
				"The INSERT statement adds new records to a database table. It requires specifying the target table, columns, and values to be inserted.",
			syntax: `INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);`,
			example: {
				code: `INSERT INTO employees (name, position, salary, department_id)
VALUES ('Alice Johnson', 'Data Analyst', 65000, 2);`,
				explanation:
					"This query adds a new employee named Alice Johnson as a Data Analyst with a salary of $65,000 in department 2.",
			},
			notes: [
				"Values must match the column data types",
				"String values should be enclosed in single quotes",
				"Consider using DEFAULT for auto-incrementing fields",
				"Multiple rows can be inserted in a single statement",
				"Verify foreign key constraints before inserting",
			],
			additionalResources: [
				{
					title: "PostgreSQL INSERT Documentation",
					url: "https://www.postgresql.org/docs/current/sql-insert.html",
				},
				{
					title: "W3Schools SQL INSERT INTO Statement",
					url: "https://www.w3schools.com/sql/sql_insert.asp",
				},
			],
			difficulty: "Beginner",
			tags: ["INSERT", "DML", "Data Entry", "SQL Fundamentals"],
		},
	},
	update: {
		exerciseParams: {
			title: "Employee Salary Adjustment",
			prompt:
				"Write a query to give a 10% salary increase to all employees in the Engineering department (department_id = 1) who have been with the company for more than 5 years.",
			tables: ["employees"],
			difficulty: "Medium",
			hints: [
				"Use the UPDATE statement with a WHERE clause",
				"Calculate the new salary using arithmetic operators",
				"Consider using the DATE_HIRED column for tenure calculation",
			],
			tips: [
				"Always include a WHERE clause to avoid updating all records",
				"Test UPDATE statements with SELECT first",
				"Use transactions for safety",
				"Consider the impact on related tables",
			],
			answer: `UPDATE employees
      SET salary = salary * 1.10
      WHERE department_id = 1
      AND DATE_HIRED <= CURRENT_DATE - INTERVAL '5 years';`,
			seed: "seed3",
			expectedRowCount: 2,
		},
		explanationParams: {
			title: "Effective UPDATE Operations",
			howItWorks:
				"The UPDATE statement modifies existing records in a database table. It can update multiple columns and rows simultaneously based on specified conditions.",
			syntax: `UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;`,
			example: {
				code: `UPDATE employees
SET position = 'Senior Developer',
    salary = salary + 5000
WHERE department_id = 1
AND performance_rating > 4;`,
				explanation:
					"This query promotes developers to senior positions and gives them a $5,000 raise if they have high performance ratings.",
			},
			notes: [
				"Always use WHERE clause unless updating all records",
				"Multiple columns can be updated in one statement",
				"Can reference current values in calculations",
				"Consider using transactions for complex updates",
				"Verify the number of affected rows",
			],
			additionalResources: [
				{
					title: "PostgreSQL UPDATE Documentation",
					url: "https://www.postgresql.org/docs/current/sql-update.html",
				},
				{
					title: "W3Schools SQL UPDATE Statement",
					url: "https://www.w3schools.com/sql/sql_update.asp",
				},
			],
			difficulty: "Intermediate",
			tags: ["UPDATE", "DML", "Data Modification", "SQL Operations"],
		},
	},
	delete: {
		exerciseParams: {
			title: "Employee Record Removal",
			prompt:
				"Write a query to remove all employees who have resigned (status = 'resigned') and haven't worked in the last 30 days.",
			tables: ["employees"],
			difficulty: "Medium",
			hints: [
				"Use the DELETE statement with appropriate conditions",
				"Consider using date functions for the last working day",
				"Think about referential integrity",
			],
			tips: [
				"Always backup data before deletion",
				"Use transactions for safety",
				"Test with SELECT first",
				"Consider soft deletes as an alternative",
			],
			answer: `DELETE FROM employees
WHERE status = 'resigned'
AND last_working_day < CURRENT_DATE - INTERVAL '30 days';`,
			seed: "seed4",
			expectedRowCount: 2,
		},
		explanationParams: {
			title: "Safe DELETE Operations",
			howItWorks:
				"The DELETE statement removes records from a database table based on specified conditions. It's permanent and should be used with caution.",
			syntax: `DELETE FROM table_name
WHERE condition;`,
			example: {
				code: `DELETE FROM employees
WHERE department_id = 3
AND performance_rating < 2
AND DATE_HIRED < CURRENT_DATE - INTERVAL '90 days';`,
				explanation:
					"This query removes employees from department 3 who have low performance ratings and have been employed for more than 90 days.",
			},
			notes: [
				"Always include a WHERE clause unless purging all records",
				"Consider foreign key constraints",
				"Use transactions for complex deletions",
				"Backup important data before deletion",
				"Consider soft deletes for audit trails",
			],
			additionalResources: [
				{
					title: "PostgreSQL DELETE Documentation",
					url: "https://www.postgresql.org/docs/current/sql-delete.html",
				},
				{
					title: "W3Schools SQL DELETE Statement",
					url: "https://www.w3schools.com/sql/sql_delete.asp",
				},
			],
			difficulty: "Intermediate",
			tags: ["DELETE", "DML", "Data Removal", "SQL Operations"],
		},
	},
};

export default PAGE_DATA;
