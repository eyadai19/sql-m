import type { TrueFalseExerciseProps as TrueFalseParams } from "@/components/Exercise/TrueFalseExercise/types";
import type {
	DragDropExerciseProps as DragDropExerciseParams,
	MultipleChoiceExerciseProps as MultipleChoiceParams,
} from "@/lib/types/exerciseTypes";

import type { ExplanationProps as ExplanationParams } from "@/components/Explanation/types";

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
	exerciseParams?: ExerciseParams;
	explanationParams?: ExplanationParams;
	trueFalseParams?: TrueFalseParams;
	multipleChoiceParams?: MultipleChoiceParams;
	dragDropParams?: DragDropExerciseParams;
}

interface PageData {
	select: PageParams;
	insert: PageParams;
	update: PageParams;
	delete: PageParams;

	dataTypes: PageParams;
	references: PageParams;
	ERD: PageParams;

	createTable: PageParams;
	dropTable: PageParams;
	alterTable: PageParams;
	schema: PageParams;

	where: PageParams;
	subQuery: PageParams;
	operator: PageParams;
	like: PageParams;
	groupBy: PageParams;
	distinct: PageParams;
	between: PageParams;
	aggregateFunction: PageParams;

	innerJoin: PageParams;
	leftJoin: PageParams;
	rightJoin: PageParams;
	outerJoin: PageParams;
	selfJoin: PageParams;
	join: PageParams;
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
			expectedRowCount: 1,
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
			expectedRowCount: 1,
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
			expectedRowCount: 3,
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
	dataTypes: {
		exerciseParams: {
			title: "Query: Data Types and Type Conversion",
			prompt:
				"Analyze the following table structure and write queries to demonstrate proper data type usage and type conversion. Focus on handling different numeric, string, and date types correctly.",
			tables: ["products"],
			difficulty: "Medium",
			hints: [
				"Consider type casting implications",
				"Think about data precision requirements",
				"Remember implicit vs explicit conversion rules",
			],
			tips: [
				"Use appropriate data types for each column",
				"Consider storage efficiency",
				"Think about data validation requirements",
			],
			answer: `-- Example table with various data types
	CREATE TABLE products (
	  id SERIAL PRIMARY KEY,
	  name VARCHAR(100),
	  price DECIMAL(10,2),
	  quantity INTEGER,
	  description TEXT,
	  created_at TIMESTAMP,
	  is_active BOOLEAN
	);
	
	-- Demonstrate type conversion and formatting
	SELECT 
	  name,
	  price::TEXT as price_string,
	  CAST(created_at AS DATE) as date_only,
	  quantity::FLOAT as quantity_float
	FROM products;`,
			seed: "seed1",
			expectedRowCount: 5,
		},
		trueFalseParams: {
			title: "True or False: Understanding Data Types",
			prompt:
				"Evaluate these statements about database data types. Mark each statement as True or False.",
			difficulty: "Medium",
			questions: [
				{
					id: "dt-1",
					statement:
						"CHAR and VARCHAR are identical in terms of storage efficiency.",
					isCorrect: false,
					explanation:
						"False. CHAR always uses fixed-length storage, while VARCHAR uses variable-length storage based on the actual content length, making VARCHAR more storage-efficient for variable-length strings.",
				},
				{
					id: "dt-2",
					statement:
						"DECIMAL data type guarantees exact numeric precision, making it suitable for financial calculations.",
					isCorrect: true,
					explanation:
						"True. DECIMAL (or NUMERIC) provides exact precision and is ideal for financial calculations where rounding errors must be avoided.",
				},
				{
					id: "dt-3",
					statement:
						"TIMESTAMP WITH TIME ZONE stores the actual time zone information along with the timestamp.",
					isCorrect: true,
					explanation:
						"True. TIMESTAMP WITH TIME ZONE stores both the timestamp and time zone information, allowing for proper timezone handling and conversion.",
				},
				{
					id: "dt-4",
					statement: "INTEGER and BIGINT can store decimal numbers.",
					isCorrect: false,
					explanation:
						"False. INTEGER and BIGINT are whole number data types. For decimal numbers, you need to use DECIMAL, NUMERIC, REAL, or DOUBLE PRECISION.",
				},
				{
					id: "dt-5",
					statement:
						"TEXT data type has a maximum length limit of 65,535 bytes.",
					isCorrect: false,
					explanation:
						"False. TEXT data type can store strings of unlimited length (limited only by the maximum row size for your database system).",
				},
			],
			hints: [
				"Consider storage implications of different types",
				"Think about precision requirements",
				"Remember type conversion rules",
			],
			tips: [
				"Focus on practical use cases",
				"Consider performance implications",
				"Think about data integrity requirements",
			],
			onComplete: (data: { time: number; trials: number }) => {
				console.log("Exercise completed:", data);
			},
		},
		dragDropParams: {
			title: "Sort: Choosing Appropriate Data Types",
			prompt:
				"Arrange the following steps in the correct order when selecting data types for a new database table.",
			items: [
				{
					id: "1",
					content:
						"Identify the type of data to be stored (numbers, text, dates, etc.)",
				},
				{
					id: "2",
					content:
						"Determine precision requirements (exact vs approximate numbers)",
				},
				{
					id: "3",
					content: "Consider storage space efficiency",
				},
				{
					id: "4",
					content: "Evaluate performance implications",
				},
				{
					id: "5",
					content: "Plan for future scaling and modifications",
				},
			],
			mode: "simple" as const,
			correctOrder: ["1", "2", "3", "4", "5"],
			difficulty: "Medium" as const,
			hints: [
				"Think about what information you need first",
				"Consider both immediate and future needs",
				"Remember performance implications",
			],
			tips: [
				"Start with basic requirements",
				"Consider both storage and performance",
				"Think about long-term maintenance",
			],
			onComplete: (data: { time: number; trials: number }) => {
				console.log("Exercise completed:", data);
			},
		},
		multipleChoiceParams: {
			title: "Multiple Choice: Data Type Selection",
			prompt: "Choose the most appropriate data type for each scenario.",
			questions: [
				{
					id: "q1",
					question:
						"Which data type is most appropriate for storing currency values?",
					imageUrl: "/images/data-types/numeric-types.png",
					choices: [
						{ id: "c1", text: "FLOAT" },
						{ id: "c2", text: "DECIMAL(10,2)" },
						{ id: "c3", text: "INTEGER" },
					],
					correctChoiceId: "c2",
					explanation:
						"DECIMAL(10,2) is ideal for currency as it provides exact decimal precision and prevents rounding errors that could occur with FLOAT.",
				},
			],
			difficulty: "Medium",
			onComplete: (data) => console.log(data),
		},
		explanationParams: {
			title: "Understanding Database Data Types",
			howItWorks:
				"Database data types define the kind of values that can be stored in a column and how those values can be used. Proper data type selection ensures data integrity, optimal storage usage, and efficient query performance.",
			syntax: `-- Common Data Type Declarations:
	-- Numeric Types
	INTEGER                 -- Whole numbers
	DECIMAL(precision,scale) -- Exact decimal numbers
	REAL                    -- Approximate decimals
	
	-- String Types
	CHAR(n)                 -- Fixed-length
	VARCHAR(n)              -- Variable-length
	TEXT                    -- Unlimited length
	
	-- Date/Time Types
	DATE                    -- Date only
	TIME                    -- Time only
	TIMESTAMP              -- Date and time
	TIMESTAMP WITH TIME ZONE -- Date, time with timezone`,
			example: {
				code: `-- Example Table with Various Data Types
	CREATE TABLE products (
	  id SERIAL PRIMARY KEY,
	  name VARCHAR(100),
	  price DECIMAL(10,2),
	  description TEXT,
	  created_at TIMESTAMP WITH TIME ZONE,
	  is_available BOOLEAN
	);`,
				explanation:
					"This example shows common data types used in a typical products table. Each column uses an appropriate data type based on its requirements: SERIAL for auto-incrementing IDs, VARCHAR for limited-length strings, DECIMAL for precise numeric values, TEXT for unlimited-length strings, TIMESTAMP for date/time tracking, and BOOLEAN for true/false values.",
			},
			notes: [
				"Choose data types based on the actual data requirements",
				"Consider storage efficiency and query performance",
				"Use exact numeric types for financial calculations",
				"Consider string length limitations and storage",
				"Time zones are important for timestamp data",
			],
			additionalResources: [
				{
					title: "PostgreSQL Data Types",
					url: "https://www.postgresql.org/docs/current/datatype.html",
				},
				{
					title: "SQL Data Types Best Practices",
					url: "https://www.sqlshack.com/sql-data-types-best-practices/",
				},
			],
			difficulty: "Beginner",
			tags: [
				"Data Types",
				"Database Design",
				"SQL",
				"Storage",
				"Performance",
				"Data Integrity",
			],
			sections: [
				{
					title: "Numeric Types",
					content:
						"Numeric types include INTEGER for whole numbers, DECIMAL/NUMERIC for exact decimal numbers, and REAL/DOUBLE PRECISION for approximate decimal numbers. Choose based on precision requirements and storage considerations.",
					image: {
						url: "/images/data-types/numeric-types-comparison.png",
						alt: "Numeric Data Types Comparison",
						caption:
							"Comparison of different numeric data types and their use cases",
					},
				},
				{
					title: "String Types",
					content:
						"String types include CHAR (fixed-length), VARCHAR (variable-length), and TEXT (unlimited length). Selection depends on storage requirements, performance needs, and data characteristics.",
					image: {
						url: "/images/data-types/string-types-comparison.png",
						alt: "String Data Types Comparison",
						caption:
							"Comparison of different string data types and their storage characteristics",
					},
				},
				{
					title: "Date and Time Types",
					content:
						"Date/time types include DATE, TIME, TIMESTAMP, and their timezone-aware variants. Choose based on temporal precision requirements and timezone handling needs.",
					image: {
						url: "/images/data-types/datetime-types-comparison.png",
						alt: "Date/Time Data Types Comparison",
						caption:
							"Overview of date and time data types and their applications",
					},
				},
			],
		},
	},

	references: {
		exerciseParams: {
			title: "Query: Primary and Foreign Key Implementation",
			prompt:
				"Given the users and orders tables, implement the necessary primary and foreign key constraints, then write queries to demonstrate referential integrity and join operations.",
			tables: ["users", "orders"],
			difficulty: "Medium",
			hints: [
				"Consider what makes each record unique in both tables",
				"Think about how orders are connected to users",
				"Remember to handle potential NULL values",
			],
			tips: [
				"Primary keys should be unique and not null",
				"Foreign keys must reference existing primary keys",
				"Consider using CASCADE options for referential actions",
			],
			answer: `-- Create tables with proper constraints
	CREATE TABLE users (
	  id SERIAL PRIMARY KEY,
	  email VARCHAR(255) UNIQUE NOT NULL,
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE orders (
	  id SERIAL PRIMARY KEY,
	  user_id INTEGER REFERENCES users(id),
	  total_amount DECIMAL(10,2) NOT NULL,
	  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	  CONSTRAINT fk_user
		FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE RESTRICT
	);
	
	-- Query to demonstrate relationship
	SELECT 
	  u.email,
	  COUNT(o.id) as order_count,
	  SUM(o.total_amount) as total_spent
	FROM users u
	LEFT JOIN orders o ON u.id = o.user_id
	GROUP BY u.id, u.email;`,
			seed: "seed4",
			expectedRowCount: 5,
		},
		trueFalseParams: {
			title: "True or False: Understanding Database Keys and References",
			prompt:
				"Evaluate these statements about primary and foreign keys. Mark each statement as True or False.",
			difficulty: "Medium",
			questions: [
				{
					id: "ref-1",
					statement:
						"A table can have multiple foreign keys but only one primary key.",
					isCorrect: true,
					explanation:
						"True. While a table can have only one primary key (which can be composite), it can have multiple foreign keys referencing different tables.",
				},
				{
					id: "ref-2",
					statement:
						"Foreign key columns must have the same name as their referenced primary key columns.",
					isCorrect: false,
					explanation:
						"False. Foreign key columns can have different names than their referenced primary key columns. Only the data types must match.",
				},
				{
					id: "ref-3",
					statement:
						"ON DELETE CASCADE automatically deletes child records when the parent record is deleted.",
					isCorrect: true,
					explanation:
						"True. The ON DELETE CASCADE referential action automatically removes dependent records in child tables when the referenced record in the parent table is deleted.",
				},
				{
					id: "ref-4",
					statement:
						"A foreign key value must always reference an existing primary key value.",
					isCorrect: false,
					explanation:
						"False. Foreign key values can be NULL (unless explicitly constrained as NOT NULL), but if they contain a value, it must reference an existing primary key.",
				},
				{
					id: "ref-5",
					statement:
						"Primary keys can be modified after table creation without affecting foreign key relationships.",
					isCorrect: false,
					explanation:
						"False. Modifying primary keys that are referenced by foreign keys requires careful handling of the referential integrity constraints and may require updating all referencing foreign keys.",
				},
			],
			hints: [
				"Think about referential integrity rules",
				"Consider the implications of key constraints",
				"Remember the relationship between primary and foreign keys",
			],
			tips: [
				"Focus on maintaining data consistency",
				"Consider practical database scenarios",
				"Think about data integrity requirements",
			],
			onComplete: (data: { time: number; trials: number }) => {
				console.log("Exercise completed:", data);
			},
		},
		dragDropParams: {
			title: "Sort: Implementing Database References",
			prompt:
				"Arrange the following steps in the correct order when implementing database references.",
			items: [
				{
					id: "1",
					content: "Identify the primary key columns in the parent table",
				},
				{
					id: "2",
					content: "Define appropriate data types for the foreign key columns",
				},
				{
					id: "3",
					content: "Add foreign key constraints with proper reference options",
				},
				{
					id: "4",
					content:
						"Determine the referential actions (CASCADE, RESTRICT, etc.)",
				},
				{
					id: "5",
					content: "Create indexes on foreign key columns for performance",
				},
			],
			mode: "simple" as const,
			correctOrder: ["1", "2", "4", "3", "5"],
			difficulty: "Medium" as const,
			hints: [
				"Think about dependencies between steps",
				"Consider performance implications",
				"Remember referential integrity requirements",
			],
			tips: [
				"Plan your key strategy carefully",
				"Consider maintenance implications",
				"Think about query performance",
			],
			onComplete: (data: { time: number; trials: number }) => {
				console.log("Exercise completed:", data);
			},
		},
		multipleChoiceParams: {
			title: "Multiple Choice: Database References",
			prompt: "Choose the correct option for each database reference scenario.",
			questions: [
				{
					id: "q1",
					question:
						"Which referential action should be used when deleting a user should also delete all their orders?",
					imageUrl: "/images/references/referential-actions.png",
					choices: [
						{ id: "c1", text: "ON DELETE RESTRICT" },
						{ id: "c2", text: "ON DELETE CASCADE" },
						{ id: "c3", text: "ON DELETE SET NULL" },
					],
					correctChoiceId: "c2",
					explanation:
						"ON DELETE CASCADE is correct because it automatically deletes all related records in the child table when a parent record is deleted.",
				},
			],
			difficulty: "Medium",
			onComplete: (data) => console.log(data),
		},
		explanationParams: {
			title: "Understanding Database References",
			howItWorks:
				"Database references establish relationships between tables using primary and foreign keys. Primary keys uniquely identify records in a table, while foreign keys create references to primary keys in other tables, maintaining referential integrity.",
			syntax: `-- Primary Key Syntax
	CREATE TABLE parent (
	  id SERIAL PRIMARY KEY,  -- Simple primary key
	  -- Composite primary key
	  (column1, column2) PRIMARY KEY
	);
	
	-- Foreign Key Syntax
	CREATE TABLE child (
	  id SERIAL PRIMARY KEY,
	  parent_id INTEGER REFERENCES parent(id),
	  -- With additional options
	  CONSTRAINT fk_parent
		FOREIGN KEY (parent_id)
		REFERENCES parent(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
	);`,
			example: {
				code: `-- Example with Users and Orders
	CREATE TABLE users (
	  id SERIAL PRIMARY KEY,
	  email VARCHAR(255) UNIQUE NOT NULL
	);
	
	CREATE TABLE orders (
	  id SERIAL PRIMARY KEY,
	  user_id INTEGER NOT NULL,
	  amount DECIMAL(10,2),
	  CONSTRAINT fk_user
		FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE RESTRICT
	);`,
				explanation:
					"This example demonstrates a common reference relationship between users and orders tables. The orders table has a foreign key (user_id) that references the primary key (id) in the users table, ensuring each order belongs to a valid user.",
			},
			notes: [
				"Primary keys must be unique and not null",
				"Foreign keys maintain referential integrity",
				"Consider appropriate referential actions",
				"Index foreign key columns for performance",
				"Use meaningful constraint names",
			],
			additionalResources: [
				{
					title: "PostgreSQL Constraints Documentation",
					url: "https://www.postgresql.org/docs/current/ddl-constraints.html",
				},
				{
					title: "Database Keys and Constraints Best Practices",
					url: "https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK",
				},
			],
			difficulty: "Beginner",
			tags: [
				"Primary Keys",
				"Foreign Keys",
				"Constraints",
				"Referential Integrity",
				"Database Design",
				"Performance",
			],
			sections: [
				{
					title: "Primary Keys",
					content:
						"Primary keys uniquely identify each record in a table. They can be single columns or composite (multiple columns). Primary keys must be unique and cannot contain NULL values.",
					image: {
						url: "/images/references/primary-key-types.png",
						alt: "Primary Key Types",
						caption:
							"Different types of primary keys and their implementations",
					},
				},
				{
					title: "Foreign Keys",
					content:
						"Foreign keys create references to primary keys in other tables, establishing relationships between tables and maintaining referential integrity.",
					image: {
						url: "/images/references/foreign-key-relationship.png",
						alt: "Foreign Key Relationships",
						caption: "How foreign keys create relationships between tables",
					},
				},
				{
					title: "Referential Actions",
					content:
						"Referential actions (CASCADE, RESTRICT, SET NULL) determine what happens to foreign key values when referenced primary key values are updated or deleted.",
					image: {
						url: "/images/references/referential-actions.png",
						alt: "Referential Actions",
						caption: "Different types of referential actions and their effects",
					},
				},
			],
		},
	},

	ERD: {
		exerciseParams: {
			title: "Query: Entity Relationship Diagram Analysis",
			prompt:
				"Looking at the relationship between the employees and departments tables, identify the type of relationship and list all the attributes that establish this relationship. Then write a query that demonstrates this relationship by showing each department and its employees.",
			tables: ["employees", "departments"],
			difficulty: "Medium",
			hints: [
				"Look at how departments and employees are connected",
				"Identify the primary and foreign keys",
				"Think about which table is the 'one' side and which is the 'many' side",
			],
			tips: [
				"Consider the cardinality of the relationship",
				"Notice how department_id in employees references id in departments",
				"Think about whether an employee can belong to multiple departments",
			],
			answer: `-- First, describe the relationship:
/*
Relationship Type: One-to-Many
- One department can have many employees
- Each employee belongs to exactly one department
- Primary Key (departments): id
- Foreign Key (employees): department_id
*/

-- Query to demonstrate the relationship:
SELECT 
  d.name AS department_name,
  e.name AS employee_name
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
ORDER BY d.name, e.name;`,
			seed: "seed3",
			expectedRowCount: 5,
		},
		trueFalseParams: {
			title: "True and False: Understanding Entity-Relationship Diagrams",
			prompt:
				"Evaluate these statements about Entity-Relationship Diagrams (ERDs). Mark each statement as True or False.",
			difficulty: "Medium" as const,
			questions: [
				{
					id: "erd-1",
					statement:
						"In an ERD, a many-to-many relationship can be directly implemented in a relational database without a junction table.",
					isCorrect: false,
					explanation:
						"False. Many-to-many relationships require a junction (bridge) table to be properly implemented in a relational database. This table contains foreign keys from both entities.",
				},
				{
					id: "erd-2",
					statement:
						"Weak entities in an ERD must have a identifying relationship with a strong entity to be meaningful.",
					isCorrect: true,
					explanation:
						"True. Weak entities depend on strong entities for their identification and cannot exist independently. They must have an identifying relationship with at least one strong entity.",
				},
				{
					id: "erd-3",
					statement:
						"Composite attributes in an ERD can be broken down into multiple simple attributes.",
					isCorrect: true,
					explanation:
						"True. Composite attributes are made up of multiple simple attributes. For example, 'address' can be broken down into street, city, state, and zip code.",
				},
				{
					id: "erd-4",
					statement:
						"Derived attributes must be physically stored in the database table.",
					isCorrect: false,
					explanation:
						"False. Derived attributes are calculated from other attributes and don't need to be stored physically. For example, age can be derived from date of birth.",
				},
				{
					id: "erd-5",
					statement:
						"A single entity in an ERD can participate in multiple relationships simultaneously.",
					isCorrect: true,
					explanation:
						"True. An entity can have relationships with multiple other entities. For example, a Student entity might relate to Course, Department, and Dormitory entities.",
				},
			],
			hints: [
				"Think about how relationships are implemented in actual database tables",
				"Consider the dependencies between different types of entities",
				"Remember the different types of attributes and their characteristics",
			],
			tips: [
				"Visualize how the concepts would be implemented in a real database",
				"Focus on the practical implications of each statement",
				"Consider both logical design and physical implementation",
			],
			onComplete: (data: { time: number; trials: number }) => {
				console.log("Exercise completed:", data);
			},
		},
		dragDropParams: {
			title: "Sort: Creating an ERD Diagram",
			prompt:
				"Arrange the following steps in the correct order to create an Entity-Relationship Diagram (ERD).",
			items: [
				{
					id: "1",
					content:
						"Identify entities (e.g., Customer, Order, Product) that represent main objects in the system",
				},
				{
					id: "2",
					content:
						"Define relationships between entities (e.g., Customer places Order, Order contains Product)",
				},
				{
					id: "3",
					content:
						"Determine attributes for each entity (e.g., Customer: name, email, address)",
				},
				{
					id: "4",
					content:
						"Specify cardinality for relationships (e.g., one-to-many, many-to-many)",
				},
				{
					id: "5",
					content:
						"Add primary and foreign keys to establish entity connections",
				},
			],
			mode: "simple" as const,
			correctOrder: ["1", "3", "2", "4", "5"],
			difficulty: "Medium" as const,
			hints: [
				"Think about what information you need before establishing connections",
				"Consider which steps depend on having other information first",
				"Remember that keys are used to implement relationships",
			],
			tips: [
				"Start with the basic building blocks before adding details",
				"Attributes help define what data each entity will store",
				"Relationships and cardinality work together to show how entities interact",
			],
			onComplete: (data: { time: number; trials: number }) => {
				console.log("Exercise completed:", data);
			},
		},
		multipleChoiceParams: {
			title: "Multiple Choice: ERD Relationships",
			prompt: "Choose the correct relationship type for each scenario.",
			questions: [
				{
					id: "q1",
					question: "What type of relationship is shown in this ERD?",
					imageUrl:
						"/image/Education/Exercise/basic/erd/one-to-many-example.png",
					choices: [
						{ id: "c1", text: "One-to-One" },
						{ id: "c2", text: "One-to-Many" },
						{ id: "c3", text: "Many-to-Many" },
					],
					correctChoiceId: "c2",
					explanation:
						"This is a one-to-many relationship as shown by the crow's foot notation.",
				},
			],
			difficulty: "Medium",
			onComplete: (data) => console.log(data),
		},
		explanationParams: {
			title: "Understanding Entity Relationship Diagrams (ERD)",
			howItWorks:
				"An ERD visualizes database structure by showing entities (tables) and their relationships. It uses specific symbols to represent different types of relationships between tables, such as one-to-one, one-to-many, or many-to-many.",
			syntax: `Relationship Notation:
1:1 (One-to-One)    →  ──┤├──
1:N (One-to-Many)    →  ──┤<──
N:M (Many-to-Many)   →  ──>│<──`,
			example: {
				code: `/* Current Database ERD:

			Departments ──┤<── Employees

			Departments
			==========
			PK id
			name
			manager
			budget
			location

			Employees
			=========
			PK id
			name
			position
			FK department_id
			salary
			date_hired
			status
			last_working_day
			*/`,
				explanation:
					"This ERD shows that one department can have multiple employees (one-to-many relationship). The department_id in the Employees table is a foreign key that references the id in the Departments table. PK indicates Primary Key, and FK indicates Foreign Key.",
			},
			notes: [
				"ERDs use specific symbols to show relationships between entities",
				"Primary keys (PK) uniquely identify each record in a table",
				"Foreign keys (FK) create relationships between tables",
				"Cardinality shows how many instances of one entity relate to another",
				"Relationships can be: one-to-one, one-to-many, or many-to-many",
			],
			additionalResources: [
				{
					title: "ERD Symbols and Notation Guide",
					url: "https://www.lucidchart.com/pages/erd-symbols-and-notation",
				},
				{
					title: "Understanding Database Relationships",
					url: "https://www.visual-paradigm.com/guide/data-modeling/what-is-entity-relationship-diagram",
				},
			],
			difficulty: "Beginner",
			tags: [
				"ERD",
				"Database Design",
				"Relationships",
				"Data Modeling",
				"Primary Key",
				"Foreign Key",
			],
			sections: [
				{
					title: "One-to-One Relationships",
					content:
						"A one-to-one relationship means that each record in Table A is related to exactly one record in Table B, and vice versa. For example, each person has one passport, and each passport belongs to one person.",
					image: {
						url: "",
						alt: "One-to-One Relationship Diagram",
						caption:
							"Visual representation of a one-to-one relationship between Person and Passport entities",
					},
				},
				{
					title: "One-to-Many Relationships",
					content:
						"A one-to-many relationship indicates that one record in Table A can be related to multiple records in Table B, but each record in Table B is related to only one record in Table A. For example, one department can have many employees.",
					image: {
						url: "",
						alt: "One-to-Many Relationship Diagram",
						caption:
							"Illustration of a one-to-many relationship between Department and Employee entities",
					},
				},
				{
					title: "Many-to-Many Relationships",
					content:
						"A many-to-many relationship means that multiple records in Table A can be related to multiple records in Table B. For example, students can enroll in multiple courses, and courses can have multiple students.",
					image: {
						url: "",
						alt: "Many-to-Many Relationship Diagram",
						caption:
							"Demonstration of a many-to-many relationship between Student and Course entities",
					},
				},
			],
		},
	},
	createTable: {
		exerciseParams: {
			title: "Creating Employee Table",
			prompt:
				"Write a CREATE TABLE statement for the employees table with appropriate data types and constraints. Include columns for id (primary key), name, position, department_id (foreign key), salary, date_hired, and status.",
			tables: [],
			difficulty: "Medium",
			hints: [
				"Consider which columns should be NOT NULL",
				"Remember to define the primary key constraint",
				"Think about the relationship with the departments table",
				"Choose appropriate data types for each column",
			],
			tips: [
				"Use INTEGER for numeric IDs",
				"VARCHAR is suitable for variable-length text",
				"DECIMAL is appropriate for salary",
				"DATE type works well for dates",
				"Define foreign keys to maintain referential integrity",
			],
			answer: `CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  department_id INTEGER NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  date_hired DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  last_working_day DATE,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);`,
			seed: "create-table-1",
			expectedRowCount: 0,
		},
		explanationParams: {
			title: "Understanding CREATE TABLE Statement",
			howItWorks:
				"The CREATE TABLE statement is used to create a new table in a database. It defines the table's structure, including column names, data types, and constraints. This statement is fundamental to database schema design.",
			syntax: `CREATE TABLE table_name (
  column1 datatype [constraints],
  column2 datatype [constraints],
  ...,
  [table_constraints]
);`,
			example: {
				code: `CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  manager VARCHAR(100) NOT NULL,
  budget DECIMAL(12,2) NOT NULL,
  location VARCHAR(100)
);`,
				explanation:
					"This example creates a departments table with five columns. The id is set as the primary key, and most fields are marked as NOT NULL to ensure data integrity. The budget field uses DECIMAL for precise monetary values.",
			},
			notes: [
				"Always define a primary key for each table",
				"Choose appropriate data types to optimize storage",
				"Use constraints to maintain data integrity",
				"Consider relationships between tables when designing schema",
				"Follow naming conventions for consistency",
			],
			additionalResources: [
				{
					title: "PostgreSQL CREATE TABLE Documentation",
					url: "https://www.postgresql.org/docs/current/sql-createtable.html",
				},
				{
					title: "MySQL CREATE TABLE Reference",
					url: "https://dev.mysql.com/doc/refman/8.0/en/create-table.html",
				},
			],
			difficulty: "Beginner",
			tags: [
				"DDL",
				"CREATE TABLE",
				"Schema Design",
				"Constraints",
				"Data Types",
			],
		},
	},
	schema: {
		exerciseParams: {
			title: "Database Schema Design",
			prompt:
				"Create a schema definition for a database that includes both the employees and departments tables, ensuring proper relationships and constraints between them.",
			tables: ["employees", "departments"],
			difficulty: "Hard",
			hints: [
				"Start with the departments table as it's referenced by employees",
				"Consider all necessary constraints for both tables",
				"Think about the relationship cardinality",
				"Plan the order of table creation",
			],
			tips: [
				"Define primary keys first",
				"Add foreign key constraints last",
				"Use consistent naming conventions",
				"Consider adding indexes for frequently queried columns",
			],
			answer: `CREATE SCHEMA company;

CREATE TABLE company.departments (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  manager VARCHAR(100) NOT NULL,
  budget DECIMAL(12,2) NOT NULL CHECK (budget > 0),
  location VARCHAR(100) NOT NULL
);

CREATE TABLE company.employees (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  department_id INTEGER NOT NULL,
  salary DECIMAL(10,2) NOT NULL CHECK (salary >= 0),
  date_hired DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'resigned')),
  last_working_day DATE,
  FOREIGN KEY (department_id) REFERENCES company.departments(id)
);

CREATE INDEX idx_emp_dept ON company.employees(department_id);
CREATE INDEX idx_emp_status ON company.employees(status);`,
			seed: "schema-def-1",
			expectedRowCount: 0,
		},
		explanationParams: {
			title: "Understanding Database Schema Definition",
			howItWorks:
				"A database schema is a blueprint that defines the structure of a database. It includes tables, relationships, constraints, and other database objects. Schema definition involves creating a logical organization of data that ensures data integrity and efficient querying.",
			syntax: `CREATE SCHEMA schema_name;

CREATE TABLE schema_name.table_name (
  columns_definition,
  constraints
);`,
			example: {
				code: `CREATE SCHEMA hr;

CREATE TABLE hr.departments (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);`,
				explanation:
					"This example creates an HR schema and a departments table within it. The schema provides a namespace for organizing database objects and controlling access permissions.",
			},
			notes: [
				"Schemas help organize database objects logically",
				"Consider security and access control when designing schemas",
				"Use appropriate constraints to maintain data integrity",
				"Plan for scalability in your schema design",
				"Document relationships between tables",
			],
			additionalResources: [
				{
					title: "PostgreSQL Schema Documentation",
					url: "https://www.postgresql.org/docs/current/ddl-schemas.html",
				},
				{
					title: "Database Design Fundamentals",
					url: "https://www.oracle.com/database/what-is-database/design-fundamentals/",
				},
			],
			difficulty: "Advanced",
			tags: [
				"DDL",
				"Schema Design",
				"Database Architecture",
				"Constraints",
				"Indexing",
			],
		},
	},
	alterTable: {
		exerciseParams: {
			title: "Modifying Table Structure",
			prompt:
				"Write ALTER TABLE statements to add a 'performance_rating' column to the employees table and modify the salary column to have a minimum value constraint.",
			tables: ["employees"],
			difficulty: "Medium",
			hints: [
				"Consider the appropriate data type for performance rating",
				"Think about constraints for the new column",
				"Remember to handle existing data",
				"Use appropriate ALTER TABLE syntax",
			],
			tips: [
				"Add constraints after adding new columns",
				"Consider default values for new columns",
				"Test modifications on a backup first",
				"Plan for data migration if needed",
			],
			answer: `ALTER TABLE employees
ADD COLUMN performance_rating DECIMAL(3,2) CHECK (performance_rating BETWEEN 1.0 AND 5.0);

ALTER TABLE employees
ADD CONSTRAINT salary_min_check CHECK (salary >= 30000);`,
			seed: "alter-table-1",
			expectedRowCount: 0,
		},
		explanationParams: {
			title: "Understanding ALTER TABLE Statement",
			howItWorks:
				"The ALTER TABLE statement modifies an existing table's structure. It can add or remove columns, modify data types, add or remove constraints, and rename table elements. This statement is crucial for maintaining and evolving database schemas.",
			syntax: `ALTER TABLE table_name
  ADD COLUMN column_name datatype [constraints],
  DROP COLUMN column_name,
  ALTER COLUMN column_name [SET DATA] TYPE new_datatype,
  ADD CONSTRAINT constraint_name constraint_definition,
  DROP CONSTRAINT constraint_name;`,
			example: {
				code: `ALTER TABLE departments
ADD COLUMN description TEXT,
ADD CONSTRAINT budget_check CHECK (budget > 0);`,
				explanation:
					"This example adds a description column to the departments table and adds a check constraint to ensure the budget is always positive.",
			},
			notes: [
				"Back up data before making structural changes",
				"Consider the impact on existing data",
				"Plan for handling NULL values in new columns",
				"Test modifications in a development environment first",
				"Document all schema changes",
			],
			additionalResources: [
				{
					title: "PostgreSQL ALTER TABLE Documentation",
					url: "https://www.postgresql.org/docs/current/sql-altertable.html",
				},
				{
					title: "MySQL ALTER TABLE Reference",
					url: "https://dev.mysql.com/doc/refman/8.0/en/alter-table.html",
				},
			],
			difficulty: "Intermediate",
			tags: [
				"DDL",
				"ALTER TABLE",
				"Schema Modification",
				"Constraints",
				"Database Management",
			],
		},
	},
	dropTable: {
		exerciseParams: {
			title: "Removing Database Objects",
			prompt:
				"Write DROP statements to safely remove the employees and departments tables, considering their relationship and the proper order of removal.",
			tables: ["employees", "departments"],
			difficulty: "Easy",
			hints: [
				"Consider table dependencies",
				"Think about the order of operations",
				"Consider using CASCADE option",
				"Plan for data backup",
			],
			tips: [
				"Always backup data before dropping tables",
				"Check for dependencies first",
				"Use IF EXISTS to prevent errors",
				"Consider using RESTRICT to prevent accidental drops",
			],
			answer: `DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;`,
			seed: "drop-table-1",
			expectedRowCount: 0,
		},
		explanationParams: {
			title: "Understanding DROP Statement",
			howItWorks:
				"The DROP statement removes database objects such as tables, schemas, or entire databases. It's a powerful DDL command that permanently deletes both the structure and data of the specified objects.",
			syntax: `DROP TABLE [IF EXISTS] table_name [CASCADE | RESTRICT];
DROP SCHEMA [IF EXISTS] schema_name [CASCADE | RESTRICT];`,
			example: {
				code: `DROP TABLE IF EXISTS employees CASCADE;
DROP SCHEMA IF EXISTS company CASCADE;`,
				explanation:
					"This example safely removes the employees table and the company schema, using CASCADE to automatically remove dependent objects. The IF EXISTS clause prevents errors if the objects don't exist.",
			},
			notes: [
				"Always backup data before dropping objects",
				"Consider dependencies when dropping tables",
				"Use IF EXISTS to make scripts more robust",
				"Understand CASCADE vs RESTRICT implications",
				"Document all schema removals",
			],
			additionalResources: [
				{
					title: "PostgreSQL DROP TABLE Documentation",
					url: "https://www.postgresql.org/docs/current/sql-droptable.html",
				},
				{
					title: "MySQL DROP TABLE Reference",
					url: "https://dev.mysql.com/doc/refman/8.0/en/drop-table.html",
				},
			],
			difficulty: "Beginner",
			tags: [
				"DDL",
				"DROP TABLE",
				"Schema Management",
				"Database Administration",
				"Data Definition",
			],
		},
	},
	where: {
		exerciseParams: {
			title: "Basic Employee Filter",
			prompt:
				"Write a query to find all active employees in the Engineering department (id=1) who earn more than $50,000.",
			tables: ["employees"],
			difficulty: "Easy",
			hints: [
				"Use WHERE clause with multiple conditions",
				"Consider the status field for active employees",
				"Think about salary comparison",
			],
			tips: [
				"Combine conditions with AND",
				"Use appropriate operators",
				"Consider column order in conditions",
			],
			answer: `SELECT name, position, salary
	FROM employees
	WHERE status = 'active'
	  AND department_id = 1
	  AND salary > 50000;`,
			seed: "where-1",
			expectedRowCount: 3,
		},
		explanationParams: {
			title: "Understanding WHERE Clause",
			howItWorks:
				"The WHERE clause filters rows based on specified conditions. It's used to retrieve only the data that meets certain criteria, making queries more specific and useful.",
			syntax: `SELECT columns
	FROM table_name
	WHERE condition1
	  AND condition2
	  OR condition3;`,
			example: {
				code: `SELECT 
	  name,
	  position,
	  salary
	FROM employees
	WHERE department_id = 2
	  AND salary >= 50000
	  AND status = 'active';`,
				explanation:
					"This query finds active employees in department 2 who earn $50,000 or more, demonstrating multiple conditions in the WHERE clause.",
			},
			notes: [
				"Filters rows before grouping and aggregation",
				"Can use comparison and logical operators",
				"Case sensitive for string comparisons",
				"NULL requires special handling (IS NULL)",
				"Consider index usage for performance",
			],
			additionalResources: [
				{
					title: "PostgreSQL WHERE Clause",
					url: "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-WHERE",
				},
				{
					title: "W3Schools WHERE Clause",
					url: "https://www.w3schools.com/sql/sql_where.asp",
				},
			],
			difficulty: "Beginner",
			tags: ["WHERE", "Filtering", "Conditions", "SQL Basics"],
		},
	},
	subQuery: {
		exerciseParams: {
			title: "Advanced Employee Query",
			prompt:
				"Write a query to find all employees who earn more than the average salary in their department.",
			tables: ["employees"],
			difficulty: "Hard",
			hints: [
				"Use a correlated subquery for department average",
				"Consider using aliases",
				"Think about NULL handling",
			],
			tips: [
				"Break down the problem into steps",
				"Test subquery independently",
				"Consider performance implications",
			],
			answer: `SELECT e1.name, e1.position, e1.salary
	FROM employees e1
	WHERE salary > (
	  SELECT AVG(salary)
	  FROM employees e2
	  WHERE e2.department_id = e1.department_id
	);`,
			seed: "subquery-1",
			expectedRowCount: 6,
		},
		explanationParams: {
			title: "Understanding Subqueries",
			howItWorks:
				"A subquery is a query nested inside another query. It can be used in various parts of the main query (SELECT, FROM, WHERE) to perform complex data retrieval and filtering operations.",
			syntax: `SELECT columns
	FROM table1
	WHERE column1 IN (
	  SELECT column2
	  FROM table2
	  WHERE condition
	);`,
			example: {
				code: `SELECT name, salary
	FROM employees
	WHERE salary > (
	  SELECT AVG(salary)
	  FROM employees
	)
	ORDER BY salary DESC;`,
				explanation:
					"This query finds employees who earn more than the company-wide average salary, demonstrating a simple subquery in the WHERE clause.",
			},
			notes: [
				"Can be used in SELECT, FROM, or WHERE clauses",
				"Correlated subqueries reference outer query",
				"Can return single value, list, or table",
				"Consider performance with large datasets",
				"Can often be rewritten as JOINs",
			],
			additionalResources: [
				{
					title: "PostgreSQL Subquery Documentation",
					url: "https://www.postgresql.org/docs/current/functions-subquery.html",
				},
				{
					title: "W3Schools SQL Subqueries",
					url: "https://www.w3schools.com/sql/sql_subqueries.asp",
				},
			],
			difficulty: "Advanced",
			tags: ["Subqueries", "Nested Queries", "Advanced SQL", "Data Analysis"],
		},
	},
	operator: {
		exerciseParams: {
			title: "Complex Employee Filter",
			prompt:
				"Write a query to find all employees who either earn more than $80,000 OR work in the Engineering department (id=1) AND were hired before 2022.",
			tables: ["employees"],
			difficulty: "Medium",
			hints: [
				"Use parentheses to group conditions",
				"Consider operator precedence",
				"Think about date comparisons",
			],
			tips: [
				"AND has higher precedence than OR",
				"Use parentheses for clarity",
				"Test conditions separately first",
			],
			answer: `SELECT name, position, salary, date_hired
	FROM employees
	WHERE (salary > 80000 OR department_id = 1)
	  AND date_hired <= '2023-01-01';`,
			seed: "operator-1",
			expectedRowCount: 4,
		},
		explanationParams: {
			title: "Understanding Logical Operators",
			howItWorks:
				"Logical operators (AND, OR, NOT) combine multiple conditions in SQL queries. They follow Boolean logic rules and can be used to create complex filtering conditions.",
			syntax: `SELECT columns
	FROM table_name
	WHERE condition1 AND condition2
	   OR condition3
	   AND NOT condition4;`,
			example: {
				code: `SELECT 
	  name,
	  salary,
	  department_id
	FROM employees
	WHERE (salary >= 60000 AND department_id = 1)
	   OR (salary >= 75000 AND department_id = 2);`,
				explanation:
					"This query demonstrates combining conditions with AND/OR to find employees meeting specific salary requirements in different departments.",
			},
			notes: [
				"AND has higher precedence than OR",
				"Use parentheses to control evaluation order",
				"NOT negates a condition",
				"Can combine multiple operators",
				"Consider performance implications",
			],
			additionalResources: [
				{
					title: "PostgreSQL Logical Operators",
					url: "https://www.postgresql.org/docs/current/functions-logical.html",
				},
				{
					title: "W3Schools SQL Operators",
					url: "https://www.w3schools.com/sql/sql_operators.asp",
				},
			],
			difficulty: "Beginner",
			tags: ["Logical Operators", "AND", "OR", "NOT", "SQL Basics"],
		},
	},
	like: {
		exerciseParams: {
			title: "Pattern Matching Search",
			prompt:
				"Write a query to find all employees whose names start with 'J' or contain 'son'.",
			tables: ["employees"],
			difficulty: "Easy",
			hints: [
				"Use LIKE with % wildcard",
				"Consider case sensitivity",
				"Think about combining conditions",
			],
			tips: [
				"Use ILIKE for case-insensitive matching",
				"% matches any sequence of characters",
				"_ matches any single character",
			],
			answer: `SELECT name, position
	FROM employees
	WHERE name ILIKE 'J%'
	   OR name ILIKE '%son%';`,
			seed: "like-1",
			expectedRowCount: 3,
		},
		explanationParams: {
			title: "Using the LIKE Operator",
			howItWorks:
				"The LIKE operator performs pattern matching using wildcards. It's commonly used for searching text fields where exact matches aren't required or known.",
			syntax: `SELECT columns
	FROM table_name
	WHERE column LIKE pattern;
	
	-- Wildcards:
	-- %    Matches any sequence of characters
	-- _    Matches any single character`,
			example: {
				code: `SELECT 
	  name,
	  position
	FROM employees
	WHERE 
	  position LIKE '%Engineer%'
	  OR name LIKE 'M%';`,
				explanation:
					"This query finds employees with 'Engineer' anywhere in their position title or names starting with 'M'.",
			},
			notes: [
				"% matches zero or more characters",
				"_ matches exactly one character",
				"ILIKE performs case-insensitive matching",
				"Can use NOT LIKE to negate patterns",
				"Consider performance on large datasets",
			],
			additionalResources: [
				{
					title: "PostgreSQL Pattern Matching",
					url: "https://www.postgresql.org/docs/current/functions-matching.html",
				},
				{
					title: "W3Schools LIKE Operator",
					url: "https://www.w3schools.com/sql/sql_like.asp",
				},
			],
			difficulty: "Beginner",
			tags: ["LIKE", "Pattern Matching", "Text Search", "SQL Basics"],
		},
	},
	groupBy: {
		exerciseParams: {
			title: "Department Statistics",
			prompt:
				"Write a query to show the number of employees and average salary for each department, but only for departments with more than 5 employees.",
			tables: ["employees", "departments"],
			difficulty: "Medium",
			hints: [
				"Use GROUP BY with department_id",
				"Consider using HAVING for filtering groups",
				"Think about joining with departments table",
			],
			tips: [
				"Use HAVING, not WHERE, for aggregate conditions",
				"Round average values for readability",
				"Include department names for context",
			],
			answer: `SELECT 
	  d.name,
	  COUNT(*) as employee_count,
	  ROUND(AVG(salary), 2) as avg_salary
	FROM employees e
	JOIN departments d ON e.department_id = d.id
	GROUP BY d.id, d.name
	HAVING COUNT(*) > 5;`,
			seed: "group-by-1",
			expectedRowCount: 2,
		},
		explanationParams: {
			title: "Understanding GROUP BY Clause",
			howItWorks:
				"The GROUP BY clause groups rows that have the same values in specified columns into summary rows. It's often used with aggregate functions to perform calculations on each group.",
			syntax: `SELECT column1, aggregate_function(column2)
	FROM table_name
	GROUP BY column1
	HAVING condition;`,
			example: {
				code: `SELECT 
	  department_id,
	  COUNT(*) as emp_count,
	  MIN(salary) as min_salary,
	  MAX(salary) as max_salary
	FROM employees
	GROUP BY department_id
	HAVING COUNT(*) >= 3;`,
				explanation:
					"This query groups employees by department and shows various statistics, but only for departments with 3 or more employees.",
			},
			notes: [
				"Must include all non-aggregated columns in GROUP BY",
				"HAVING filters groups, WHERE filters rows",
				"Can group by multiple columns",
				"Often used with aggregate functions",
				"Consider indexing GROUP BY columns",
			],
			additionalResources: [
				{
					title: "PostgreSQL GROUP BY Clause",
					url: "https://www.postgresql.org/docs/current/queries-group.html",
				},
				{
					title: "MySQL GROUP BY",
					url: "https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html",
				},
			],
			difficulty: "Intermediate",
			tags: ["GROUP BY", "HAVING", "Aggregation", "Data Analysis"],
		},
	},
	distinct: {
		exerciseParams: {
			title: "Unique Position Titles",
			prompt:
				"Write a query to find all unique job positions in the company, ordered alphabetically.",
			tables: ["employees"],
			difficulty: "Easy",
			hints: [
				"Use DISTINCT to eliminate duplicates",
				"Consider case sensitivity",
				"Think about sorting the results",
			],
			tips: [
				"DISTINCT can be used with multiple columns",
				"Consider using ORDER BY for better presentation",
				"Think about NULL handling if relevant",
			],
			answer: `SELECT DISTINCT position
	FROM employees
	ORDER BY position;`,
			seed: "distinct-1",
			expectedRowCount: 8,
		},
		explanationParams: {
			title: "Understanding DISTINCT Clause",
			howItWorks:
				"The DISTINCT clause eliminates duplicate rows from the result set. When used with multiple columns, it considers the combination of all specified columns for uniqueness.",
			syntax: `SELECT DISTINCT column1, column2
	FROM table_name
	[ORDER BY column1];`,
			example: {
				code: `SELECT DISTINCT 
	  department_id,
	  position
	FROM employees
	ORDER BY department_id, position;`,
				explanation:
					"This query finds unique combinations of departments and positions, showing the distribution of job roles across departments.",
			},
			notes: [
				"DISTINCT considers NULL values as equal",
				"Can be used with multiple columns",
				"Affects performance on large datasets",
				"Often used with aggregates like COUNT(DISTINCT)",
				"Consider indexes for better performance",
			],
			additionalResources: [
				{
					title: "PostgreSQL DISTINCT Clause",
					url: "https://www.postgresql.org/docs/current/sql-select.html#SQL-DISTINCT",
				},
				{
					title: "W3Schools DISTINCT Keyword",
					url: "https://www.w3schools.com/sql/sql_distinct.asp",
				},
			],
			difficulty: "Beginner",
			tags: ["DISTINCT", "Unique Values", "Data Selection", "SQL Basics"],
		},
	},
	between: {
		exerciseParams: {
			title: "Salary Range Query",
			prompt:
				"Write a query to find all employees with salaries between $50,000 and $75,000.",
			tables: ["employees"],
			difficulty: "Easy",
			hints: [
				"Use the BETWEEN operator for the salary range",
				"Consider including both boundary values",
				"Think about the order of results",
			],
			tips: [
				"BETWEEN is inclusive of both values",
				"Consider using ORDER BY for better presentation",
				"Include relevant columns for context",
			],
			answer: `SELECT 
	  name,
	  position,
	  salary
	FROM employees
	WHERE salary BETWEEN 50000 AND 75000
	ORDER BY salary;`,
			seed: "between-1",
			expectedRowCount: 5,
		},
		explanationParams: {
			title: "Using the BETWEEN Operator",
			howItWorks:
				"The BETWEEN operator selects values within a given range, inclusive of the boundary values. It can be used with numbers, dates, and strings, providing a cleaner alternative to using >= and <= operators.",
			syntax: `SELECT column1, column2
	FROM table_name
	WHERE column_name BETWEEN value1 AND value2;`,
			example: {
				code: `SELECT 
	  name,
	  date_hired,
	  salary
	FROM employees
	WHERE date_hired BETWEEN '2023-01-01' AND '2023-12-31'
	  AND salary BETWEEN 45000 AND 85000;`,
				explanation:
					"This query finds employees hired in 2023 with salaries between $45,000 and $85,000, demonstrating BETWEEN with both dates and numbers.",
			},
			notes: [
				"BETWEEN is inclusive of both start and end values",
				"Can be used with numbers, dates, and strings",
				"Order matters: first value must be lower than second",
				"NULL values are not included in the range",
				"Can combine with other conditions using AND/OR",
			],
			additionalResources: [
				{
					title: "PostgreSQL BETWEEN Operator",
					url: "https://www.postgresql.org/docs/current/functions-comparison.html",
				},
				{
					title: "W3Schools BETWEEN Operator",
					url: "https://www.w3schools.com/sql/sql_between.asp",
				},
			],
			difficulty: "Beginner",
			tags: ["BETWEEN", "Comparison Operators", "Range Queries", "SQL Basics"],
		},
	},
	aggregateFunction: {
		exerciseParams: {
			title: "Sales Analysis with Aggregate Functions",
			prompt:
				"Write a query using aggregate functions to find the total salary cost, average salary, and count of employees per department.",
			tables: ["employees", "departments"],
			difficulty: "Medium",
			hints: [
				"Use GROUP BY with department_id",
				"Consider multiple aggregate functions in one query",
				"Think about formatting numeric results",
			],
			tips: [
				"Use ROUND for cleaner decimal numbers",
				"Consider using column aliases for readability",
				"Remember to join with departments table for department names",
			],
			answer: `SELECT 
	  d.name,
	  COUNT(*) as employee_count,
	  SUM(salary) as total_salary,
	  ROUND(AVG(salary), 2) as avg_salary
	FROM employees e
	JOIN departments d ON e.department_id = d.id
	GROUP BY d.id, d.name;`,
			seed: "agg-func-1",
			expectedRowCount: 4,
		},
		explanationParams: {
			title: "Understanding Aggregate Functions",
			howItWorks:
				"Aggregate functions perform calculations on a set of rows and return a single result. Common functions include COUNT, SUM, AVG, MAX, and MIN. They're often used with GROUP BY to analyze data by categories.",
			syntax: `SELECT 
	  column1,
	  COUNT(*),
	  SUM(column2),
	  AVG(column3),
	  MAX(column4),
	  MIN(column5)
	FROM table_name
	GROUP BY column1;`,
			example: {
				code: `SELECT 
	  department_id,
	  COUNT(*) as emp_count,
	  SUM(salary) as total_cost,
	  ROUND(AVG(salary), 2) as avg_salary,
	  MAX(salary) as highest_salary,
	  MIN(salary) as lowest_salary
	FROM employees
	GROUP BY department_id;`,
				explanation:
					"This query calculates various statistics about employee salaries grouped by department, including the count of employees, total salary cost, average salary, and salary range.",
			},
			notes: [
				"Aggregate functions ignore NULL values by default",
				"Use COUNT(*) to count rows, COUNT(column) to count non-null values",
				"GROUP BY is required when mixing aggregate and non-aggregate columns",
				"HAVING clause filters grouped results",
				"Can combine multiple aggregate functions in one query",
			],
			additionalResources: [
				{
					title: "PostgreSQL Aggregate Functions",
					url: "https://www.postgresql.org/docs/current/functions-aggregate.html",
				},
				{
					title: "MySQL Aggregate Functions",
					url: "https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html",
				},
			],
			difficulty: "Intermediate",
			tags: [
				"Aggregate Functions",
				"GROUP BY",
				"SQL Analytics",
				"Data Analysis",
			],
		},
	},
	innerJoin: {
		exerciseParams: {
			title: "Basic Table Relationships",
			prompt:
				"Write a query to demonstrate a basic INNER JOIN between two related tables.",
			tables: ["employees", "departments"],
			difficulty: "Easy",
			hints: [
				"Consider the primary key-foreign key relationship",
				"Think about which columns link the tables",
				"Add meaningful conditions to filter results",
			],
			tips: [
				"Use clear table aliases",
				"Select only necessary columns",
				"Consider query performance",
			],
			answer: `SELECT e.name, e.position, e.salary, d.name as department_name, d.location
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE d.name = 'Engineering' AND e.status = 'active';`,
			seed: "seed_inner_join",
			expectedRowCount: 2,
		},
		explanationParams: {
			title: "Matching Records with INNER JOIN",
			howItWorks:
				"INNER JOIN creates a result set containing only the records where the specified columns match in both tables. It's the most common type of join, used when you want to retrieve only complete, matching data sets.",
			syntax: `SELECT columns
FROM table1 t1
INNER JOIN table2 t2 ON t1.column = t2.column;`,
			example: {
				code: `SELECT e.name, e.position, d.name as department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary > 70000;`,
				explanation:
					"Demonstrates a basic INNER JOIN retrieving matching records based on a relationship between tables.",
			},
			notes: [
				"Returns only matching records",
				"Eliminates incomplete relationships",
				"Ensures data integrity",
				"Optimal for required relationships",
				"Common in data analysis",
			],
			additionalResources: [
				{
					title: "W3Schools SQL INNER JOIN",
					url: "https://www.w3schools.com/sql/sql_join_inner.asp",
				},
				{
					title: "PostgreSQL INNER JOIN",
					url: "https://www.postgresql.org/docs/current/tutorial-join.html",
				},
			],
			difficulty: "Beginner",
			tags: [
				"INNER JOIN",
				"Basic Queries",
				"Data Relationships",
				"SQL Fundamentals",
			],
		},
	},
	leftJoin: {
		exerciseParams: {
			title: "Preserving Source Records",
			prompt:
				"Write a query that keeps all records from the left table while matching available data from the right table.",
			tables: ["employees", "departments"],
			difficulty: "Medium",
			hints: [
				"Keep all records from the first table",
				"Handle missing matches appropriately",
				"Consider NULL value handling",
			],
			tips: [
				"Use NULL handling functions",
				"Consider default values",
				"Plan result ordering",
			],
			answer: `SELECT e.name, e.position, e.salary,
       COALESCE(d.name, 'Unassigned') as department_name,
       e.status
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
ORDER BY e.salary DESC;`,
			seed: "seed_left_join",
			expectedRowCount: 10,
		},
		explanationParams: {
			title: "Preserving Left Table Data with LEFT JOIN",
			howItWorks:
				"LEFT JOIN retains all records from the left (first) table and matches them with records from the right table where possible. When no match exists, NULL values are used for the right table's columns.",
			syntax: `SELECT columns
FROM table1 t1
LEFT JOIN table2 t2 ON t1.column = t2.column;`,
			example: {
				code: `SELECT e.name, e.status, d.name as department
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
WHERE e.status = 'active';`,
				explanation:
					"Shows how LEFT JOIN preserves all records from the first table while matching available data from the second table.",
			},
			notes: [
				"Keeps all left table records",
				"Handles missing relationships",
				"Useful for optional relationships",
				"Common in reporting scenarios",
				"Helps identify missing data",
			],
			additionalResources: [
				{
					title: "W3Schools SQL LEFT JOIN",
					url: "https://www.w3schools.com/sql/sql_join_left.asp",
				},
				{
					title: "PostgreSQL LEFT JOIN",
					url: "https://www.postgresql.org/docs/current/tutorial-join.html",
				},
			],
			difficulty: "Intermediate",
			tags: [
				"LEFT JOIN",
				"Data Preservation",
				"Optional Relationships",
				"SQL Joins",
			],
		},
	},
	rightJoin: {
		exerciseParams: {
			title: "Right Table Data Preservation",
			prompt:
				"Create a query that maintains all records from the right table while matching data from the left table where possible.",
			tables: ["employees", "departments"],
			difficulty: "Medium",
			hints: [
				"Focus on preserving right table data",
				"Consider unmatched departments",
				"Think about NULL handling",
			],
			tips: [
				"Use COALESCE for NULL values",
				"Consider column ordering",
				"Think about meaningful defaults",
			],
			answer: `SELECT d.name as department_name, d.manager,
       COUNT(e.id) as employee_count,
       COALESCE(AVG(e.salary), 0) as avg_salary
FROM departments d
RIGHT JOIN employees e ON e.department_id = d.id
GROUP BY d.name, d.manager;`,
			seed: "seed_right_join",
			expectedRowCount: 9,
		},
		explanationParams: {
			title: "Understanding RIGHT JOIN Operations",
			howItWorks:
				"RIGHT JOIN preserves all records from the right (second) table while matching records from the left table where possible. Unmatched records from the left table result in NULL values.",
			syntax: `SELECT columns
FROM table1 t1
RIGHT JOIN table2 t2 ON t1.column = t2.column;`,
			example: {
				code: `SELECT d.name, COUNT(e.id) as staff_count
FROM departments d
RIGHT JOIN employees e ON e.department_id = d.id
GROUP BY d.name;`,
				explanation:
					"Demonstrates RIGHT JOIN usage by showing all departments and their employee counts, including departments with no employees.",
			},
			notes: [
				"Preserves all right table records",
				"Mirrors LEFT JOIN behavior",
				"Useful for complete right table analysis",
				"Handles missing relationships",
				"Common in inventory and resource management",
			],
			additionalResources: [
				{
					title: "W3Schools SQL RIGHT JOIN",
					url: "https://www.w3schools.com/sql/sql_join_right.asp",
				},
				{
					title: "PostgreSQL RIGHT JOIN",
					url: "https://www.postgresql.org/docs/current/tutorial-join.html",
				},
			],
			difficulty: "Intermediate",
			tags: ["RIGHT JOIN", "Data Analysis", "SQL Joins", "Data Relationships"],
		},
	},
	outerJoin: {
		exerciseParams: {
			title: "Complete Data Integration",
			prompt:
				"Write a query that combines all records from both tables, matching where possible and preserving unmatched records.",
			tables: ["employees", "departments"],
			difficulty: "Hard",
			hints: [
				"Include all records from both tables",
				"Handle unmatched records properly",
				"Consider aggregation possibilities",
			],
			tips: [
				"Use COALESCE for NULL handling",
				"Consider meaningful defaults",
				"Think about result ordering",
			],
			answer: `SELECT COALESCE(e.name, 'No Employee') as employee_name,
       COALESCE(d.name, 'Unassigned') as department_name,
       e.salary, d.budget
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.id
ORDER BY e.salary DESC NULLS LAST;`,
			seed: "seed_outer_join",
			expectedRowCount: 12,
		},
		explanationParams: {
			title: "Comprehensive Data Combination with FULL OUTER JOIN",
			howItWorks:
				"FULL OUTER JOIN combines all records from both tables, matching records where possible and including unmatched records from both tables with NULL values for missing data.",
			syntax: `SELECT columns
FROM table1 t1
FULL OUTER JOIN table2 t2 ON t1.column = t2.column;`,
			example: {
				code: `SELECT e.name, d.name as department, e.salary
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.id;`,
				explanation:
					"Shows complete data integration between employees and departments, including unmatched records from both tables.",
			},
			notes: [
				"Combines all records from both tables",
				"Preserves unmatched records",
				"Useful for data completeness analysis",
				"Identifies missing relationships",
				"Important for data quality checks",
			],
			additionalResources: [
				{
					title: "W3Schools SQL FULL OUTER JOIN",
					url: "https://www.w3schools.com/sql/sql_join_full.asp",
				},
				{
					title: "PostgreSQL FULL OUTER JOIN",
					url: "https://www.postgresql.org/docs/current/tutorial-join.html",
				},
			],
			difficulty: "Advanced",
			tags: [
				"FULL OUTER JOIN",
				"Data Integration",
				"Complete Data Sets",
				"SQL Joins",
			],
		},
	},
	selfJoin: {
		exerciseParams: {
			title: "Self-Referential Relationships",
			prompt:
				"Create a query that joins a table with itself to explore hierarchical or self-referential relationships.",
			tables: ["employees"],
			difficulty: "Hard",
			hints: [
				"Use different aliases for the same table",
				"Think about hierarchical relationships",
				"Consider recursive patterns",
			],
			tips: [
				"Clear alias naming is crucial",
				"Consider relationship direction",
				"Handle circular references",
			],
			answer: `SELECT e1.name as employee_name,
       e1.position as employee_position,
       e2.name as manager_name,
       e2.position as manager_position
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id
WHERE e1.status = 'active'
ORDER BY e2.name;`,
			seed: "seed_self_join",
			expectedRowCount: 8,
		},
		explanationParams: {
			title: "Self-Referential Data Analysis with SELF JOIN",
			howItWorks:
				"SELF JOIN connects a table to itself, typically using different aliases, to analyze hierarchical or self-referential relationships within the same dataset.",
			syntax: `SELECT columns
FROM table1 t1
JOIN table1 t2 ON t1.column = t2.related_column;`,
			example: {
				code: `SELECT e1.name as employee, e2.name as manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;`,
				explanation:
					"Demonstrates how to use SELF JOIN to show employee-manager relationships within the same table.",
			},
			notes: [
				"Useful for hierarchical data",
				"Requires clear alias distinction",
				"Common in organizational structures",
				"Handles recursive relationships",
				"Important for tree-like data",
			],
			additionalResources: [
				{
					title: "W3Schools SQL SELF JOIN",
					url: "https://www.w3schools.com/sql/sql_join_self.asp",
				},
				{
					title: "PostgreSQL SELF JOIN",
					url: "https://www.postgresql.org/docs/current/tutorial-join.html",
				},
			],
			difficulty: "Advanced",
			tags: [
				"SELF JOIN",
				"Hierarchical Data",
				"Recursive Queries",
				"SQL Joins",
			],
		},
	},
	join: {
		exerciseParams: {
			title: "General Join Operations",
			prompt:
				"Write a query demonstrating the versatile use of JOIN with additional conditions and filtering.",
			tables: ["employees", "departments"],
			difficulty: "Medium",
			hints: [
				"Consider join conditions carefully",
				"Think about additional filtering",
				"Plan result presentation",
			],
			tips: [
				"Use appropriate join type",
				"Consider performance impact",
				"Think about data quality",
			],
			answer: `SELECT e.name, e.position,
       d.name as department_name,
       d.location,
       e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.status = 'active'
  AND d.budget > 500000
ORDER BY e.salary DESC;`,
			seed: "seed_general_join",
			expectedRowCount: 5,
		},
		explanationParams: {
			title: "Flexible Data Combination with JOIN",
			howItWorks:
				"JOIN (without a specific type) defaults to INNER JOIN, providing a flexible way to combine related tables based on matching values in specified columns.",
			syntax: `SELECT columns
FROM table1 t1
JOIN table2 t2 ON t1.column = t2.column
WHERE conditions;`,
			example: {
				code: `SELECT e.name, d.name as department, e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE d.budget > 300000;`,
				explanation:
					"Shows basic JOIN usage with additional filtering conditions to combine related data from multiple tables.",
			},
			notes: [
				"Defaults to INNER JOIN",
				"Requires explicit join condition",
				"Supports additional filtering",
				"Basic building block of queries",
				"Essential for data relationships",
			],
			additionalResources: [
				{
					title: "W3Schools SQL JOIN",
					url: "https://www.w3schools.com/sql/sql_join.asp",
				},
				{
					title: "PostgreSQL JOIN Types",
					url: "https://www.postgresql.org/docs/current/tutorial-join.html",
				},
			],
			difficulty: "Intermediate",
			tags: [
				"JOIN",
				"Data Relationships",
				"SQL Fundamentals",
				"Query Building",
			],
		},
	},
};

export default PAGE_DATA;
