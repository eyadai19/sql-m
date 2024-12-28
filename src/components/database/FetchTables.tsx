"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { userDbApi } from "@/utils/apis";
import { useEffect, useState } from "react";
import Mermaid from "react-mermaid2";

interface Table {
	tableName: string;
	columns: { columnName: string; columnType: string }[]; 
	data: Record<string, any>[]; // البيانات في الجدول
}

export default function FetchTablesWithERD() {
	const [tables, setTables] = useState<Table[]>([]);
	const [erdDiagram, setErdDiagram] = useState<string>("");
	const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);

	const fetchTables = async () => {
		try {
			const response = await fetch(userDbApi);
			const data = await response.json();

			if (!response.ok) {
				alert(data.error || "خطأ أثناء جلب الجداول.");
				return;
			}

			setTables(data);

			const erd = generateERD(data);
			setErdDiagram(erd);
			setHasAccess(true); // تغيير حالة الوصول بعد نجاح جلب البيانات
		} catch (error) {
			console.error("خطأ أثناء جلب الجداول:", error);
			alert("حدث خطأ أثناء جلب الجداول.");
			setHasAccess(false); // تغيير حالة الوصول في حالة حدوث خطأ
		}
	};

	const generateERD = (tables: Table[]) => {
		let diagram = "erDiagram\n";

		tables.forEach((table) => {
			diagram += `${table.tableName} {\n`;
			table.columns.forEach((col) => {
				diagram += `  ${col.columnType} ${col.columnName}\n`;
			});
			diagram += "}\n";
		});

		// التعرف التلقائي على العلاقات
		tables.forEach((table) => {
			table.columns.forEach((col) => {
				// التحقق إذا كان العمود يبدو كأنه مفتاح أجنبي
				tables.forEach((relatedTable) => {
					if (
						col.columnName
							.toLowerCase()
							.includes(relatedTable.tableName.toLowerCase()) &&
						col.columnName.toLowerCase().includes("id")
					) {
						diagram += `\n  ${table.tableName} ||--o{ ${relatedTable.tableName} : "Foreign Key"\n`;
					}
				});
			});
		});

		return diagram;
	};

	useEffect(() => {
		fetchTables();
	}, []);

	// عرض الرسالة المتحركة إذا كانت hasAccess غير محددة
	if (hasAccess === undefined) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-8"
			style={{
				background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
			}}>
			<Card className="w-4/5 rounded-lg border border-gray-200 bg-white shadow-md">
				<CardHeader>
					<h1 className="text-center text-3xl font-semibold text-[#00203F]">
						My DB Viewer
					</h1>
				</CardHeader>
				<CardContent>
					{erdDiagram && (
						<div className="mb-8 rounded-lg border bg-white p-6 shadow-md">
							<h2 className="mb-4 text-2xl font-bold text-[#00203F]">
								مخطط ERD
							</h2>
							<Mermaid chart={erdDiagram} />
						</div>
					)}
					{tables.length > 0 ? (
						<div className="space-y-6">
							{tables.map((table, index) => (
								<div
									key={index}
									className="rounded-lg border border-gray-300 bg-gray-100 p-4"
								>
									<h2 className="mb-4 text-xl font-bold text-[#00203F]">
										{table.tableName}
									</h2>
									<h3 className="mb-2 text-lg font-semibold text-[#00203F]">
										الأعمدة:
									</h3>
									<ul className="list-disc pl-5">
										{table.columns.map((col, colIndex) => (
											<li key={colIndex} className="text-[#00203F]">
												{col.columnName} ({col.columnType})
											</li>
										))}
									</ul>
									<h3 className="mb-2 mt-4 text-lg font-semibold text-[#00203F]">
										البيانات:
									</h3>
									{table.data.length > 0 ? (
										<Table>
											<TableHeader>
												<TableRow>
													{table.columns.map((col, colIndex) => (
														<TableHead key={colIndex}>
															{col.columnName}
														</TableHead>
													))}
												</TableRow>
											</TableHeader>
											<TableBody>
												{table.data.map((row, rowIndex) => (
													<TableRow key={rowIndex}>
														{table.columns.map((col, colIndex) => (
															<TableCell key={colIndex}>
																{row[col.columnName] !== undefined
																	? row[col.columnName]
																	: "NULL"}
															</TableCell>
														))}
													</TableRow>
												))}
											</TableBody>
										</Table>
									) : (
										<p className="text-[#00203F]">
											لا توجد بيانات في هذا الجدول.
										</p>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-center text-[#00203F]">لا توجد جداول لعرضها.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
