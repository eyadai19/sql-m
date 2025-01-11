import type { OperationType, QueryResult } from "@/lib/types/exerciseDatabase";
import {
	DUMMY_DEPARTMENTS_TABLE,
	DUMMY_EMPLOYEES_TABLE,
} from "@/utils/dummyData";
import getDummyDataSubset from "@/utils/getDummyDataSubset";
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
			// Get operation type
			const operationType = this.getOperationType(query);

			// Handle non-SELECT operations
			if (operationType !== "SELECT") {
				await this.db.run(query); // Execute user query
				if (operationType == "CREATE" || operationType == "ALTER") {
					const tables = await this.db.all(`
						SELECT name 
						FROM sqlite_master 
						WHERE type = 'table' AND name NOT LIKE 'sqlite_%';
					`);

					for (const table of tables) {
						await this.db.exec(`DROP TABLE IF EXISTS ${table.name}`);
						console.log(`Dropped table: ${table.name}`);
					}
					if (operationType == "ALTER") {
						await this.initialize();
					}
				}
				await this.db.run(realQuery); // Execute real query for validation

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

			// Handle SELECT operations
			const userResult: Record<string, any>[] = await this.db.all(query);

			// Check if SELECT query returned results
			if (userResult.length === 0) {
				throw new Error("User query returned no results.");
			}

			const realResult: Record<string, any>[] = await this.db.all(realQuery);

			// Check if results match
			const allMatch = realResult.every((realRow: Record<string, any>) =>
				userResult.some((userRow: Record<string, any>) =>
					Object.keys(realRow).every((key) => realRow[key] === userRow[key]),
				),
			);

			if (!allMatch) {
				throw new Error(
					"User query results do not match the required query results.",
				);
			}

			return {
				columns: userResult.length > 0 ? Object.keys(userResult[0]) : [],
				rows: userResult.map((row: Record<string, any>) => Object.values(row)),
				operation: {
					type: operationType,
					rowCount: userResult.length,
				},
			};
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
		if (normalizedQuery.startsWith("drop")) return "DROP";
		if (normalizedQuery.startsWith("alter")) return "ALTER";
		if (normalizedQuery.startsWith("create")) return "CREATE";

		return "SELECT";
	}

	async cleanup() {
		try {
			// الحصول على أسماء جميع الجداول في قاعدة البيانات
			const tables = await this.db.all(`
			SELECT name 
			FROM sqlite_master 
			WHERE type = 'table' AND name NOT LIKE 'sqlite_%';
		`);

			// إذا لم تكن هناك جداول، فقط أغلق الاتصال
			if (tables.length === 0) {
				console.log("No tables to drop.");
				await this.db.close();
				return;
			}

			// حذف كل الجداول
			for (const table of tables) {
				await this.db.exec(`DROP TABLE IF EXISTS ${table.name}`);
				console.log(`Dropped table: ${table.name}`);
			}
		} catch (err) {
			console.error("Error cleaning up database:", err);
		} finally {
			// التأكد من إغلاق الاتصال بقاعدة البيانات
			try {
				await this.db.close();
			} catch (closeErr) {
				console.error("Error closing database connection:", closeErr);
			}
		}
	}
}
