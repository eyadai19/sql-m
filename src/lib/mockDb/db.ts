import type {
	DatabaseRow,
	OperationType,
	QueryResult,
	TablesSnapshot,
} from "@/lib/types/mockDatabase";
import {
	DUMMY_DEPARTMENTS_TABLE,
	DUMMY_EMPLOYEES_TABLE,
} from "@/utils/dummyData";
import getDummyDataSubset from "@/utils/getDummyDataSubset";
import { Pool, PoolClient } from "pg";

export class TempDatabase {
	private pool: Pool;
	private seed: string;
	private employeesCount: number;
	private departmentsCount: number;
	private currentId: number = 1;

	constructor(seed: string, employeesCount: number, departmentsCount: number) {
		console.log("eyad hassnn : " + process.env.POSTGRES_DB);

		this.pool = new Pool({
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			host: process.env.POSTGRES_HOST,
			port: parseInt(process.env.POSTGRES_PORT || "5432"),
			database: process.env.POSTGRES_DB,
		});
		this.seed = seed;
		this.employeesCount = employeesCount;
		this.departmentsCount = departmentsCount;
	}

	async initialize() {
		const client = await this.pool.connect();
		try {
			// Create temporary tables with serial id
			await client.query(`
        CREATE TEMP TABLE employees (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          position VARCHAR(100),
          department_id INTEGER,
          salary INTEGER,
          date_hired DATE,
          status VARCHAR(50) DEFAULT 'active',
          last_working_day DATE
        );

        CREATE TEMP TABLE departments (
          id INTEGER PRIMARY KEY,
          name VARCHAR(100),
          manager VARCHAR(100),
          budget INTEGER,
          location VARCHAR(100)
        );
      `);

			// Get subsets of dummy data
			const employees = getDummyDataSubset(
				DUMMY_EMPLOYEES_TABLE.rows,
				this.seed,
				this.employeesCount,
			);
			const departments = getDummyDataSubset(
				DUMMY_DEPARTMENTS_TABLE.rows,
				this.seed,
				this.departmentsCount,
			);

			// Insert data into temporary tables
			for (const emp of employees) {
				await client.query(
					"INSERT INTO employees (name, position, department_id, salary, date_hired, status, last_working_day) VALUES ($1, $2, $3, $4, $5, $6, $7)",
					[
						emp.name,
						emp.position,
						emp.department_id,
						emp.salary,
						emp.date_hired,
						emp.status,
						emp.last_working_day,
					],
				);
			}

			for (const dept of departments) {
				await client.query(
					"INSERT INTO departments (id, name, manager, budget, location) VALUES ($1, $2, $3, $4, $5)",
					[dept.id, dept.name, dept.manager, dept.budget, dept.location],
				);
			}

			// Get the current max id
			const result = await client.query("SELECT MAX(id) FROM employees");
			this.currentId = (result.rows[0].max || 0) + 1;
		} finally {
			client.release();
		}
	}

	async executeQuery(query: string): Promise<QueryResult> {
		const client = await this.pool.connect();
		try {
			// First, get a snapshot of the affected tables before the operation
			const tablesBefore = await this.getTablesSnapshot(client);

			// Execute the query
			const result = await client.query(query);

			// Get operation type from the query
			const operationType = this.getOperationType(query);

			if (operationType === "SELECT") {
				return {
					columns: result.fields.map((field) => field.name),
					rows: result.rows.map((row) => Object.values(row)),
					operation: {
						type: operationType,
						rowCount: result.rowCount || 0,
					},
				};
			} else {
				// For INSERT, UPDATE, DELETE, get affected rows
				const tablesAfter = await this.getTablesSnapshot(client);
				const affectedRows = this.getAffectedRows(
					tablesBefore,
					tablesAfter,
					operationType,
				);

				return {
					columns: affectedRows.columns,
					rows: affectedRows.rows,
					operation: {
						type: operationType,
						rowCount: result.rowCount || 0,
					},
				};
			}
		} finally {
			client.release();
		}
	}

	private async getTablesSnapshot(client: PoolClient): Promise<TablesSnapshot> {
		const employees = await client.query("SELECT * FROM employees ORDER BY id");
		const departments = await client.query(
			"SELECT * FROM departments ORDER BY id",
		);
		return { employees, departments };
	}

	private getOperationType(query: string): OperationType {
		const normalizedQuery = query.trim().toLowerCase();
		if (normalizedQuery.startsWith("select")) return "SELECT";
		if (normalizedQuery.startsWith("insert")) return "INSERT";
		if (normalizedQuery.startsWith("update")) return "UPDATE";
		if (normalizedQuery.startsWith("delete")) return "DELETE";
		return "SELECT"; // Default fallback
	}

	private getAffectedRows(
		before: TablesSnapshot,
		after: TablesSnapshot,
		operationType: OperationType,
	) {
		const columns = [
			"id",
			"name",
			"position",
			"department_id",
			"salary",
			"date_hired",
			"status",
			"last_working_day",
		];

		switch (operationType) {
			case "INSERT":
				return {
					columns,
					rows: after.employees.rows
						.filter(
							(row: DatabaseRow) =>
								!before.employees.rows.find(
									(r: DatabaseRow) => r.id === row.id,
								),
						)
						.map((row: DatabaseRow) => Object.values(row)),
				};

			case "UPDATE":
				return {
					columns,
					rows: after.employees.rows
						.filter((row: DatabaseRow) => {
							const beforeRow = before.employees.rows.find(
								(r: DatabaseRow) => r.id === row.id,
							);
							return (
								beforeRow && JSON.stringify(beforeRow) !== JSON.stringify(row)
							);
						})
						.map((row: DatabaseRow) => Object.values(row)),
				};

			case "DELETE":
				return {
					columns,
					rows: before.employees.rows
						.filter(
							(row: DatabaseRow) =>
								!after.employees.rows.find((r: DatabaseRow) => r.id === row.id),
						)
						.map((row: DatabaseRow) => Object.values(row)),
				};

			default:
				return { columns: [], rows: [] };
		}
	}

	async cleanup() {
		const client = await this.pool.connect();
		try {
			await client.query(`
        DROP TABLE IF EXISTS employees;
        DROP TABLE IF EXISTS departments;
      `);
		} finally {
			client.release();
			await this.pool.end();
		}
	}
}
