import { NextRequest, NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

// دالة لفتح قاعدة البيانات
const getDb = async () => {
	return open({
		filename: "../db",
		driver: sqlite3.Database,
	});
};

// نقطة النهاية POST للتعامل مع CREATE و DROP و INSERT و SELECT
export async function POST(req: NextRequest) {
	try {
		const db = await getDb();
		const { action, tableName, columns, values, selectColumns } =
			await req.json();

		if (!tableName) {
			return NextResponse.json({ error: "اسم الجدول مفقود." }, { status: 400 });
		}

		if (action === "CREATE") {
			if (!columns || columns.length === 0) {
				return NextResponse.json({ error: "الأعمدة مفقودة." }, { status: 400 });
			}

			// تحويل الأعمدة إلى صيغة SQL
			const columnsSQL = columns
				.map((col: string) => {
					const [columnName, columnType] = col.split(" ").map((s) => s.trim());
					return `${columnName} ${columnType}`;
				})
				.join(", ");

			const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsSQL})`;
			await db.exec(createTableQuery);

			return NextResponse.json(
				{ message: `تم إنشاء الجدول "${tableName}" بنجاح.` },
				{ status: 200 },
			);
		} else if (action === "DROP") {
			// تنفيذ تعليمة DROP
			await db.exec(`DROP TABLE IF EXISTS ${tableName}`);
			return NextResponse.json(
				{ message: `تم حذف الجدول "${tableName}" بنجاح.` },
				{ status: 200 },
			);
		} else if (action === "INSERT") {
			if (!values || values.length === 0) {
				return NextResponse.json({ error: "القيم مفقودة." }, { status: 400 });
			}

			// تحويل القيم إلى صيغة SQL
			const placeholders = values.map(() => "?").join(", ");
			const insertQuery = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;

			await db.run(insertQuery, ...values);

			return NextResponse.json(
				{ message: `تم إدخال البيانات في الجدول "${tableName}" بنجاح.` },
				{ status: 200 },
			);
		} else if (action === "SELECT") {
			if (!selectColumns || selectColumns.length === 0) {
				return NextResponse.json(
					{ error: "الأعمدة المطلوبة للاستعلام مفقودة." },
					{ status: 400 },
				);
			}

			const selectQuery = `SELECT ${selectColumns.join(", ")} FROM ${tableName}`;
			const result = await db.all(selectQuery);

			return NextResponse.json(
				{ message: "تم جلب البيانات بنجاح.", data: result },
				{ status: 200 },
			);
		} else {
			return NextResponse.json(
				{ error: "العملية غير مدعومة." },
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				error: "حدث خطأ أثناء تنفيذ العملية.",
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
			`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
		);

		// الحصول على الأعمدة مع النوع لكل جدول
		const tablesWithColumns = await Promise.all(
			tables.map(async (table: { name: string }) => {
				const columns = await db.all(`PRAGMA table_info(${table.name});`);
				return {
					tableName: table.name,
					columns: columns.map((col: any) => ({
						columnName: col.name,
						columnType: col.type,
					})),
				};
			}),
		);

		return NextResponse.json(tablesWithColumns, { status: 200 });
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				error: "حدث خطأ أثناء جلب الجداول.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
