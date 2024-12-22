import type { OperationType, QueryResult } from "@/lib/types/mockDatabase";
import {
	DUMMY_DEPARTMENTS_TABLE,
	DUMMY_EMPLOYEES_TABLE,
	EmployeeRow,
} from "@/utils/dummyData";
import getDummyDataSubset from "@/utils/getDummyDataSubset";
import { parse } from "sql-parser";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const getDb = async () => {
	return open({
		filename: "../ExerciseDb",
		driver: sqlite3.Database,
	});
};

export class TempDatabase {
	private db: any;
	private seed: string;
	private employeesCount: number;
	private departmentsCount: number;

	constructor(seed: string, employeesCount: number, departmentsCount: number) {
		this.seed = seed;
		this.employeesCount = employeesCount;
		this.departmentsCount = departmentsCount;
	}

	async initialize() {
		this.db = await getDb();
		try {
			// Create temporary tables
			await this.db.exec(`
				CREATE TABLE IF NOT EXISTS employees (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT,
					position TEXT,
					department_id INTEGER,
					salary INTEGER,
					date_hired TEXT,
					status TEXT DEFAULT 'active',
					last_working_day TEXT
				);

				CREATE TABLE IF NOT EXISTS departments (
					id INTEGER PRIMARY KEY,
					name TEXT,
					manager TEXT,
					budget INTEGER,
					location TEXT
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

			// Insert data into tables
			for (const emp of employees) {
				await this.db.run(
					"INSERT INTO employees (name, position, department_id, salary, date_hired, status, last_working_day) VALUES (?, ?, ?, ?, ?, ?, ?)",
					emp.name,
					emp.position,
					emp.department_id,
					emp.salary,
					emp.date_hired,
					emp.status,
					emp.last_working_day,
				);
			}

			for (const dept of departments) {
				await this.db.run(
					"INSERT INTO departments (id, name, manager, budget, location) VALUES (?, ?, ?, ?, ?)",
					dept.id,
					dept.name,
					dept.manager,
					dept.budget,
					dept.location,
				);
			}
		} catch (err) {
			console.error("Error initializing database:", err);
		}
	}

	async executeQuery(query: string, realQuery: string): Promise<QueryResult> {
		try {
			// const userQueryParsed = parse(query);
			// const realQueryParsed = parse(realQuery);

			// const userTables: string[] = userQueryParsed.tables || [];
			// const realTables: string[] = realQueryParsed.tables || [];

			// const userColumns: string[] = userQueryParsed.columns || [];
			// const realColumns: string[] = realQueryParsed.columns || [];

			// const tablesMatch = realTables.every((table: string) =>
			// 	userTables.includes(table),
			// );

			// const columnsMatch = realColumns.every((column: string) =>
			// 	userColumns.includes(column),
			// );

			// if (!tablesMatch || !columnsMatch) {
			// 	throw new Error(
			// 		"User query does not match the required query structure.",
			// 	);
			// }

			const result = await this.db.all(query);

			const operationType = this.getOperationType(query);

			if (operationType === "SELECT") {
				return {
					columns: result.length > 0 ? Object.keys(result[0]) : [],
					rows: result.map((row: EmployeeRow) => Object.values(row)),
					operation: {
						type: operationType,
						rowCount: result.length,
					},
				};
			} else {
				const rowCount = await this.db.get("SELECT changes() AS count");
				return {
					columns: [],
					rows: [],
					operation: {
						type: operationType,
						rowCount: rowCount.count,
					},
				};
			}
		} catch (err) {
			console.error("Error executing query:", err);
			throw err;
		}
	}

	private getOperationType(query: string): OperationType {
		const normalizedQuery = query.trim().toLowerCase();
		if (normalizedQuery.startsWith("select")) return "SELECT";
		if (normalizedQuery.startsWith("insert")) return "INSERT";
		if (normalizedQuery.startsWith("update")) return "UPDATE";
		if (normalizedQuery.startsWith("delete")) return "DELETE";
		return "SELECT"; // Default fallback
	}

	async cleanup() {
		try {
			await this.db.exec(`
				DROP TABLE IF EXISTS employees;
				DROP TABLE IF EXISTS departments;
			`);
			await this.db.close();
		} catch (err) {
			console.error("Error cleaning up database:", err);
		}
	}
}
