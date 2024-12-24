import { NextRequest, NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const getDb = async () => {
	return open({
		filename: "../db",
		driver: sqlite3.Database,
	});
};

export async function POST(req: NextRequest) {
	try {
		const db = await getDb();
		const { query } = await req.json();

		if (typeof query !== "string" || query.trim() === "") {
			throw new Error("Invalid query. Must be a non-empty string.");
		}

		const queryType = query.trim().toLowerCase().split(" ")[0];

		switch (queryType) {
			case "select": {
				try {
					const rows = await db.all(query);
					return NextResponse.json({ data: rows }, { status: 200 });
				} catch (error) {
					console.error("SELECT query error:", error);
					return NextResponse.json(
						{
							error: "فشل استعلام SELECT. تأكد من صحة الجدول أو الأعمدة.",
							originalError:
								error instanceof Error ? error.message : String(error),
						},
						{ status: 500 },
					);
				}
			}

			case "insert": {
				try {
					await db.exec(query);
					return NextResponse.json(
						{ message: "تم تنفيذ INSERT بنجاح" },
						{ status: 200 },
					);
				} catch (error) {
					console.error("INSERT query error:", error);
					return NextResponse.json(
						{
							error: "فشل استعلام INSERT. تحقق من صحة القيم أو الجدول.",
							originalError:
								error instanceof Error ? error.message : String(error),
						},
						{ status: 500 },
					);
				}
			}

			case "drop": {
				try {
					await db.exec(query);
					return NextResponse.json(
						{ message: "تم تنفيذ DROP بنجاح" },
						{ status: 200 },
					);
				} catch (error) {
					console.error("DROP query error:", error);
					return NextResponse.json(
						{
							error: "فشل استعلام DROP. تأكد من وجود الجدول المراد حذفه.",
							originalError:
								error instanceof Error ? error.message : String(error),
						},
						{ status: 500 },
					);
				}
			}

			case "create": {
				try {
					await db.exec(query);
					return NextResponse.json(
						{ message: "تم تنفيذ CREATE بنجاح" },
						{ status: 200 },
					);
				} catch (error) {
					console.error("CREATE query error:", error);
					return NextResponse.json(
						{
							error: "فشل استعلام CREATE. تأكد من صحة تعريف الجدول.",
							originalError:
								error instanceof Error ? error.message : String(error),
						},
						{ status: 500 },
					);
				}
			}

			case "alter": {
				try {
					await db.exec(query);
					return NextResponse.json(
						{ message: "تم تنفيذ ALTER بنجاح" },
						{ status: 200 },
					);
				} catch (error) {
					console.error("ALTER query error:", error);
					return NextResponse.json(
						{
							error: "فشل استعلام ALTER. تأكد من صحة الجدول أو الأعمدة.",
							originalError:
								error instanceof Error ? error.message : String(error),
						},
						{ status: 500 },
					);
				}
			}

			case "delete": {
				try {
					await db.exec(query);
					return NextResponse.json(
						{ message: "تم تنفيذ DELETE بنجاح" },
						{ status: 200 },
					);
				} catch (error) {
					console.error("DELETE query error:", error);
					return NextResponse.json(
						{
							error: "فشل استعلام DELETE. تحقق من صحة الشروط أو الجدول.",
							originalError:
								error instanceof Error ? error.message : String(error),
						},
						{ status: 500 },
					);
				}
			}

			default: {
				throw new Error(
					"Unsupported query type. Only SELECT, INSERT, DROP, CREATE, ALTER, and DELETE are allowed.",
				);
			}
		}
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				error: "حدث خطأ أثناء تنفيذ العملية.",
				originalError: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

export async function GET(req: NextRequest) {
	try {
		const db = await getDb();
		const tables = await db.all(
			`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
		);
		const tablesWithColumnsAndData = await Promise.all(
			tables.map(async (table: { name: string }) => {
				const columns = await db.all(`PRAGMA table_info(${table.name});`);
				const data = await db.all(`SELECT * FROM ${table.name}`);
				return {
					tableName: table.name,
					columns: columns.map((col: any) => ({
						columnName: col.name,
						columnType: col.type,
					})),
					data,
				};
			}),
		);
		return NextResponse.json(tablesWithColumnsAndData, { status: 200 });
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				error: "حدث خطأ أثناء جلب الجداول والبيانات.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
