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
		const {
			action,
			tableName,
			columns,
			values,
			selectColumns,
			actionType,
			columnName,
			columnType,
			setColumns,
			whereConditions,
		} = await req.json();

		if (!tableName) {
			return NextResponse.json({ error: "اسم الجدول مفقود." }, { status: 400 });
		}

		if (action === "ALTER") {
			if (!actionType || !columnName) {
				return NextResponse.json(
					{ error: "إجراء ALTER غير مكتمل." },
					{ status: 400 },
				);
			}
			let alterQuery = "";
			if (actionType === "ADD" && columnType) {
				alterQuery = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`;
			} else if (actionType === "DROP") {
				alterQuery = `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`;
			} else {
				return NextResponse.json(
					{ error: "إجراء ALTER غير صالح." },
					{ status: 400 },
				);
			}
			await db.exec(alterQuery);
			return NextResponse.json(
				{ message: `تم تعديل هيكل الجدول "${tableName}" بنجاح.` },
				{ status: 200 },
			);
		}

		if (action === "DELETE") {
			if (!whereConditions || whereConditions.length === 0) {
				return NextResponse.json(
					{ error: "شروط WHERE مفقودة." },
					{ status: 400 },
				);
			}
			const whereClauses = whereConditions.join(" AND ");
			const deleteQuery = `DELETE FROM ${tableName} WHERE ${whereClauses}`;
			try {
				await db.exec(deleteQuery);
				return NextResponse.json(
					{ message: `تم حذف البيانات من الجدول "${tableName}" بنجاح.` },
					{ status: 200 },
				);
			} catch (error) {
				console.error("Error while deleting data:", error);
				return NextResponse.json(
					{ error: "حدث خطأ أثناء حذف البيانات." },
					{ status: 500 },
				);
			}
		}

		if (action === "UPDATE") {
			if (!setColumns || setColumns.length === 0) {
				return NextResponse.json(
					{ error: "الأعمدة التي سيتم تحديثها مفقودة." },
					{ status: 400 },
				);
			}
			if (!whereConditions || whereConditions.length === 0) {
				return NextResponse.json(
					{ error: "شروط WHERE مفقودة." },
					{ status: 400 },
				);
			}

			const setClauses = setColumns
				.map(
					({ column, value }: { column: string; value: string }) =>
						`${column} = ?`,
				)
				.join(", ");
			const whereClauses = whereConditions.join(" AND ");
			const updateQuery = `UPDATE ${tableName} SET ${setClauses} WHERE ${whereClauses}`;
			const updateValues = setColumns.map(
				({ value }: { column: string; value: string }) => value,
			);
			await db.run(updateQuery, ...updateValues);
			return NextResponse.json(
				{ message: `تم تحديث البيانات في الجدول "${tableName}" بنجاح.` },
				{ status: 200 },
			);
		}

		if (action === "CREATE") {
			if (!columns || columns.length === 0) {
				return NextResponse.json({ error: "الأعمدة مفقودة." }, { status: 400 });
			}
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
			await db.exec(`DROP TABLE IF EXISTS ${tableName}`);
			return NextResponse.json(
				{ message: `تم حذف الجدول "${tableName}" بنجاح.` },
				{ status: 200 },
			);
		} else if (action === "INSERT") {
			if (!values || values.length === 0) {
				return NextResponse.json({ error: "القيم مفقودة." }, { status: 400 });
			}
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

		// الحصول على أسماء الجداول
		const tables = await db.all(
			`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
		);

		// الحصول على الأعمدة مع النوع والبيانات لكل جدول
		const tablesWithColumnsAndData = await Promise.all(
			tables.map(async (table: { name: string }) => {
				// جلب معلومات الأعمدة
				const columns = await db.all(`PRAGMA table_info(${table.name});`);
				// جلب البيانات من الجدول
				const data = await db.all(`SELECT * FROM ${table.name}`);
				return {
					tableName: table.name,
					columns: columns.map((col: any) => ({
						columnName: col.name,
						columnType: col.type,
					})),
					data, // بيانات الجدول
				};
			})
		);

		return NextResponse.json(tablesWithColumnsAndData, { status: 200 });
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				error: "حدث خطأ أثناء جلب الجداول والبيانات.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}

