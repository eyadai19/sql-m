import { TempDatabase } from "@/lib/mockDb/db";
import type { QueryResult } from "@/lib/types/mockDatabase";
import { NextRequest, NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const getDb = async () => {
	return open({
		filename: "../ExerciseDb",
		driver: sqlite3.Database,
	});
};
export async function POST(req: NextRequest) {
	try {
		const { query, seed, employeesCount, departmentsCount , answer } = await req.json();

		// Only prevent system-level commands
		if (
			query.toLowerCase().includes("drop database") ||
			query.toLowerCase().includes("create database") ||
			query.toLowerCase().includes("alter database") ||
			query.toLowerCase().includes("truncate database")
		) {
			return NextResponse.json(
				{ error: "Invalid query: Database-level operations are not allowed" },
				{ status: 400 },
			);
		}

		// Create temporary database and execute query
		const db = new TempDatabase(seed, employeesCount, departmentsCount);
		await db.initialize();

		try {
			const result = await db.executeQuery(query , answer);

			// Add operation-specific success messages
			let successMessage;
			switch (result.operation.type) {
				case "INSERT":
					successMessage = `Successfully inserted ${result.operation.rowCount} row(s). Showing inserted records:`;
					break;
				case "UPDATE":
					successMessage = `Successfully updated ${result.operation.rowCount} row(s). Showing updated records:`;
					break;
				case "DELETE":
					successMessage = `Successfully deleted ${result.operation.rowCount} row(s). Showing deleted records:`;
					break;
				default:
					successMessage = result.rows.length
						? `Query returned ${result.rows.length} row(s):`
						: "Query executed successfully.";
			}

			const response: QueryResult = {
				...result,
				successMessage,
			};

			return NextResponse.json(response);
		} finally {
			await db.cleanup();
		}
	} catch (error: any) {
		console.error("Query execution error:", error);
		return NextResponse.json(
			{
				error: error.message || "An error occurred while processing your query",
			},
			{ status: 500 },
		);
	}
}
