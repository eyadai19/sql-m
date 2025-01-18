import { NextRequest, NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const getDb = async () => {
	return open({
		filename: "../db",
		driver: sqlite3.Database,
	});
};

const getTableColumns = async (
	db: any,
	tableName: string,
): Promise<string[]> => {
	try {
		const columns = await db.all(`PRAGMA table_info(${tableName});`);
		return columns.map((column: any) => column.name);
	} catch (error) {
		console.error(`Error fetching columns for table "${tableName}":`, error);
		throw new Error(`Failed to fetch columns for table "${tableName}".`);
	}
};

export async function POST(req: NextRequest) {
	try {
		const { tableName } = await req.json(); // استخراج اسم الجدول من الطلب

		if (!tableName || typeof tableName !== "string") {
			return NextResponse.json(
				{ error: "Invalid or missing 'tableName' in request body." },
				{ status: 400 },
			);
		}

		const db = await getDb();
		const columns = await getTableColumns(db, tableName); // استدعاء دالة استرجاع الأعمدة
		await db.close();

		return NextResponse.json({ columns });
	} catch (error) {
		console.error("Error in POST handler:", error);
		return NextResponse.json(
			{
				error: "An error occurred while retrieving columns for the table.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

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
