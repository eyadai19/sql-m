import { NextRequest, NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const getDb = async () => {
	return open({
		filename: "../db",
		driver: sqlite3.Database,
	});
};

export async function GET(req: NextRequest) {
	try {
		const db = await getDb();

		const tables = await db.all(
			`SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
		);

		let tablesDefinition = "tables:\n";
		tables.forEach((table) => {
			tablesDefinition += `${table.sql};\n`;
		});

		await db.close();
		return NextResponse.json({
			context: tablesDefinition.trim(),
		});
	} catch (error) {
		console.error("Error fetching table definitions:", error);
		return NextResponse.json(
			{
				error: "An error occurred while retrieving the database context.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
