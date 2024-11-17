"use client";
import React, { useState } from "react";

const DatabaseManager: React.FC = () => {
	const [createQuery, setCreateQuery] = useState<string>(""); // حفظ تعليمة CREATE
	const [dropQuery, setDropQuery] = useState<string>(""); // حفظ تعليمة DROP
	const [insertQuery, setInsertQuery] = useState<string>(""); // حفظ تعليمة INSERT
	const [selectQuery, setSelectQuery] = useState<string>(""); // حفظ تعليمة SELECT
	const [tables, setTables] = useState<
		{
			tableName: string;
			columns: { columnName: string; columnType: string }[];
		}[]
	>([]);
	const [selectResults, setSelectResults] = useState<Record<string, string>[]>(
		[],
	);

	// دالة لعرض الجداول
	const fetchTables = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/db");
			const data = await response.json();
			console.log(data); // تأكد من طباعة البيانات في وحدة التحكم
			if (!response.ok) {
				alert(data.error || "خطأ أثناء جلب الجداول.");
				return;
			}
			setTables(data);
		} catch (error) {
			console.error("خطأ أثناء جلب الجداول:", error);
			alert("حدث خطأ أثناء جلب الجداول.");
		}
	};

	// دالة لإنشاء جدول بعد التحقق من صحة تعليمة CREATE
	const validateAndCreateTable = async () => {
		const regex = /^CREATE\s+TABLE\s+(\S+)\s*\(([\s\S]+)\)$/i;
		const match = createQuery.trim().match(regex);

		if (!match) {
			alert("تعليمة CREATE غير صحيحة.");
			return;
		}

		const tableName = match[1];
		const columnsPart = match[2].trim();
		const columns = columnsPart
			.split(",")
			.map((col) => col.trim())
			.filter(Boolean);

		if (!tableName || columns.length === 0) {
			alert("اسم الجدول أو الأعمدة مفقودة.");
			return;
		}

		try {
			const response = await fetch("http://localhost:3000/api/db", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "CREATE", tableName, columns }), // إرسال اسم الجدول والأعمدة
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(errorData.error || "خطأ أثناء إنشاء الجدول.");
				return;
			}

			const data = await response.json();
			alert(data.message);
			setCreateQuery(""); // مسح الحقل بعد النجاح
		} catch (error) {
			console.error("خطأ أثناء إنشاء الجدول:", error);
			alert("حدث خطأ أثناء إنشاء الجدول.");
		}
	};

	// دالة لحذف جدول بعد التحقق من صحة تعليمة DROP
	const validateAndDropTable = async () => {
		const regex = /^DROP\s+TABLE\s+(\S+)$/i;
		const match = dropQuery.trim().match(regex);

		if (!match) {
			alert("تعليمة DROP غير صحيحة.");
			return;
		}

		const tableName = match[1];

		try {
			const response = await fetch("http://localhost:3000/api/db", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "DROP", tableName }), // إرسال اسم الجدول
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(errorData.error || "خطأ أثناء حذف الجدول.");
				return;
			}

			const data = await response.json();
			alert(data.message);
			setDropQuery(""); // مسح الحقل بعد النجاح
		} catch (error) {
			console.error("خطأ أثناء حذف الجدول:", error);
			alert("حدث خطأ أثناء حذف الجدول.");
		}
	};

	// دالة لإدخال بيانات بعد التحقق من صحة تعليمة INSERT
	const validateAndInsertData = async () => {
		const regex =
			/^INSERT\s+INTO\s+(\S+)\s*\(([\s\S]+)\)\s+VALUES\s*\(([\s\S]+)\)$/i;
		const match = insertQuery.trim().match(regex);

		if (!match) {
			alert("تعليمة INSERT غير صحيحة.");
			return;
		}

		const tableName = match[1];
		const columnsPart = match[2].trim();
		const valuesPart = match[3].trim();

		const columns = columnsPart.split(",").map((col) => col.trim());
		const values = valuesPart.split(",").map((val) => val.trim());

		if (!tableName || columns.length === 0 || values.length === 0) {
			alert("معلومات الإدخال غير مكتملة.");
			return;
		}

		try {
			const response = await fetch("http://localhost:3000/api/db", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "INSERT", tableName, columns, values }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(errorData.error || "خطأ أثناء إدخال البيانات.");
				return;
			}

			const data = await response.json();
			alert(data.message);
			setInsertQuery(""); // مسح الحقل بعد النجاح
		} catch (error) {
			console.error("خطأ أثناء إدخال البيانات:", error);
			alert("حدث خطأ أثناء إدخال البيانات.");
		}
	};

	// دالة لاستعلام SELECT بعد التحقق من صحة التعليمة
	const validateAndSelectData = async () => {
		const regex = /^SELECT\s+([\s\S]+)\s+FROM\s+(\S+)$/i;
		const match = selectQuery.trim().match(regex);

		if (!match) {
			alert("تعليمة SELECT غير صحيحة.");
			return;
		}

		const columnsPart = match[1].trim();
		const tableName = match[2].trim();

		const columns = columnsPart.split(",").map((col) => col.trim());

		if (!tableName || columns.length === 0) {
			alert("معلومات الاستعلام غير مكتملة.");
			return;
		}

		try {
			const response = await fetch("http://localhost:3000/api/db", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "SELECT",
					tableName,
					selectColumns: columns,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(errorData.error || "خطأ أثناء تنفيذ الاستعلام.");
				return;
			}

			const data = await response.json();
			alert(data.message);
			setSelectQuery(""); // مسح الحقل بعد النجاح
			setSelectResults(data.data); // تعيين النتائج لعرضها
		} catch (error) {
			console.error("خطأ أثناء تنفيذ الاستعلام:", error);
			alert("حدث خطأ أثناء تنفيذ الاستعلام.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<h1 className="mb-8 text-center text-3xl font-bold text-blue-600">
				إدارة قاعدة البيانات
			</h1>

			{/* عرض الجداول */}
			<div className="mb-8">
				<button
					onClick={fetchTables}
					className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
				>
					عرض الجداول
				</button>
				{/* عرض الجداول */}
				{tables.length > 0 ? (
					<ul>
						{tables.map((table, index) => (
							<li key={index}>
								<strong>{table.tableName}</strong>
								<ul>
									{table.columns.map((col, colIndex) => (
										<li key={colIndex}>
											{col.columnName} ({col.columnType})
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				) : (
					<p>لا توجد جداول لعرضها.</p>
				)}
			</div>

			{/* إنشاء جدول */}
			<div className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">إنشاء جدول</h2>
				<input
					type="text"
					value={createQuery}
					onChange={(e) => setCreateQuery(e.target.value)}
					placeholder="تعليمة CREATE"
					className="mb-2 w-full rounded-md border border-gray-300 p-3 shadow-sm"
				/>
				<button
					onClick={validateAndCreateTable}
					className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
				>
					إنشاء جدول
				</button>
			</div>

			{/* حذف جدول */}
			<div className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">حذف جدول</h2>
				<input
					type="text"
					value={dropQuery}
					onChange={(e) => setDropQuery(e.target.value)}
					placeholder="تعليمة DROP"
					className="mb-2 w-full rounded-md border border-gray-300 p-3 shadow-sm"
				/>
				<button
					onClick={validateAndDropTable}
					className="rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700"
				>
					حذف جدول
				</button>
			</div>

			{/* إدخال بيانات */}
			<div className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">إدخال بيانات</h2>
				<input
					type="text"
					value={insertQuery}
					onChange={(e) => setInsertQuery(e.target.value)}
					placeholder="تعليمة INSERT"
					className="mb-2 w-full rounded-md border border-gray-300 p-3 shadow-sm"
				/>
				<button
					onClick={validateAndInsertData}
					className="rounded-md bg-yellow-600 px-4 py-2 text-white shadow hover:bg-yellow-700"
				>
					إدخال بيانات
				</button>
			</div>

			{/* استعلام SELECT */}
			<div className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">استعلام SELECT</h2>
				<input
					type="text"
					value={selectQuery}
					onChange={(e) => setSelectQuery(e.target.value)}
					placeholder="تعليمة SELECT"
					className="mb-2 w-full rounded-md border border-gray-300 p-3 shadow-sm"
				/>
				<button
					onClick={validateAndSelectData}
					className="rounded-md bg-purple-600 px-4 py-2 text-white shadow hover:bg-purple-700"
				>
					تنفيذ استعلام SELECT
				</button>
			</div>

			{/* عرض نتائج الاستعلام */}
			{selectResults.length > 0 && (
				<div className="mb-8">
					<h2 className="mb-4 text-xl font-semibold">نتائج الاستعلام</h2>
					<div className="overflow-x-auto rounded-md border border-gray-300 shadow">
						<table className="min-w-full bg-white">
							<thead>
								<tr>
									{selectResults[0] &&
										Object.keys(selectResults[0]).map((key) => (
											<th
												key={key}
												className="border-b px-4 py-2 text-left font-medium text-gray-700"
											>
												{key}
											</th>
										))}
								</tr>
							</thead>
							<tbody>
								{selectResults.map((row, index) => (
									<tr key={index}>
										{Object.values(row).map((value, idx) => (
											<td key={idx} className="border-b px-4 py-2">
												{value}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default DatabaseManager;
