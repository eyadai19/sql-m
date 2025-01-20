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
import { userDbApi, userDbRelationshipsApi } from "@/utils/apis";
import mermaid from "mermaid";
import { useEffect, useState } from "react";

interface Table {
	tableName: string;
	columns: { columnName: string; columnType: string }[];
	data: Record<string, any>[];
}
interface Relation {
	table: string;
	from: string;
	to: string;
}

interface ApiResponse {
	tableName: string;
	columns: { columnName: string; columnType: string }[];
	relations: Relation[];
}
export default function FetchTablesWithERD() {
	const [tables, setTables] = useState<Table[]>([]);
	const [erdDiagram, setErdDiagram] = useState<string>("");
	const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
	const [openTables, setOpenTables] = useState<Set<number>>(new Set());

	const toggleTable = (index: number) => {
		setOpenTables((prev) => {
			const newOpenTables = new Set(prev);
			if (newOpenTables.has(index)) {
				newOpenTables.delete(index);
			} else {
				newOpenTables.add(index);
			}
			return newOpenTables;
		});
	};

	const isTableOpen = (index: number) => {
		return openTables.has(index);
	};

	const fetchTables = async () => {
		try {
			const response = await fetch(userDbApi);
			const data = await response.json();

			if (!response.ok) {
				alert(data.error || "خطأ أثناء جلب الجداول.");
				return;
			}

			setTables(data);

			const erdResponse = await fetch(userDbRelationshipsApi);
			const erdData = await erdResponse.json();

			if (!response.ok) {
				alert(data.error || "خطأ أثناء جلب الجداول.");
				return;
			}

			const erd = generateERD(erdData);
			setErdDiagram(erd);
			setHasAccess(true);
		} catch (error) {
			console.error("خطأ أثناء جلب الجداول:", error);
			alert("حدث خطأ أثناء جلب الجداول.");
			setHasAccess(false);
		}
	};

	const generateERD = (tables: ApiResponse[]) => {
		let diagram = "erDiagram\n";

		tables.forEach((table) => {
			diagram += `${table.tableName} {\n`;
			table.columns.forEach((col) => {
				diagram += `  ${col.columnType} ${col.columnName}\n`;
			});
			diagram += "}\n";
		});

		tables.forEach((table) => {
			table.relations.forEach((relation) => {
				diagram += `${table.tableName} ||--o{ ${relation.table} : "${relation.from} -> ${relation.to}"\n`;
			});
		});

		return diagram;
	};

	useEffect(() => {
		mermaid.initialize({ startOnLoad: true });
	}, []);

	// إعادة تحميل mermaid عند تغيير مخطط ERD
	useEffect(() => {
		if (erdDiagram) {
			mermaid.contentLoaded();
		}
	}, [erdDiagram]);

	useEffect(() => {
		fetchTables();
	}, []);

	if (hasAccess === undefined) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	return (
		<div
			className="flex min-h-screen items-center justify-center px-4 py-8"
			style={{
				background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
			}}
		>
			<Card className="w-full max-w-4xl rounded-lg border border-gray-200 bg-white shadow-md">
				<CardHeader>
					<h1 className="text-center text-2xl font-semibold text-[#00203F] sm:text-3xl">
						My DB Viewer
					</h1>
				</CardHeader>
				<CardContent className="space-y-6">
					{erdDiagram && (
						<div className="rounded-lg border bg-white p-4 shadow-md sm:p-6">
							<h2 className="mb-4 text-xl font-bold text-[#00203F] sm:text-2xl">
								ERD
							</h2>
							<div className="overflow-x-auto">
								{/* استخدام mermaid لعرض مخطط ERD */}
								<div className="mermaid">{erdDiagram}</div>
							</div>
						</div>
					)}
					{tables.length > 0 ? (
						<div className="space-y-6">
							{tables.map((table, index) => (
								<div
									key={index}
									className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
								>
									{/* Table Header */}
									<div className="mb-4 flex items-center justify-between">
										<h2 className="text-xl font-bold text-[#00203F]">
											{table.tableName}
										</h2>
										<button
											onClick={() => toggleTable(index)}
											className="text-[#00203F] hover:text-[#ADF0D1]"
										>
											{/* أيقونة طي/فرد */}
											{isTableOpen(index) ? (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 15l7-7 7 7"
													/>
												</svg>
											)}
										</button>
									</div>

									{/* Columns */}
									{isTableOpen(index) && (
										<>
											<h3 className="mb-2 text-lg font-semibold text-[#00203F]">
												Columns:
											</h3>
											<ul className="mb-4 list-disc pl-5">
												{table.columns.map((col, colIndex) => (
													<li key={colIndex} className="text-[#00203F]">
														{col.columnName} ({col.columnType})
													</li>
												))}
											</ul>

											{/* Data */}
											<h3 className="mb-2 text-lg font-semibold text-[#00203F]">
												Data:
											</h3>
											{table.data.length > 0 ? (
												<div className="overflow-x-auto rounded-lg border border-gray-200">
													<Table className="min-w-full">
														<TableHeader className="bg-[#00203F]">
															<TableRow>
																{table.columns.map((col, colIndex) => (
																	<TableHead
																		key={colIndex}
																		className="text-sm font-bold text-white"
																	>
																		{col.columnName}
																	</TableHead>
																))}
															</TableRow>
														</TableHeader>
														<TableBody>
															{table.data.map((row, rowIndex) => (
																<TableRow
																	key={rowIndex}
																	className={
																		rowIndex % 2 === 0
																			? "bg-gray-50"
																			: "bg-white"
																	}
																>
																	{table.columns.map((col, colIndex) => (
																		<TableCell
																			key={colIndex}
																			className="text-sm text-[#00203F]"
																		>
																			{row[col.columnName] !== undefined
																				? row[col.columnName]
																				: "NULL"}
																		</TableCell>
																	))}
																</TableRow>
															))}
														</TableBody>
													</Table>
												</div>
											) : (
												<p className="text-[#00203F]">
													No data available in this table.
												</p>
											)}
										</>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-center text-[#00203F]">
							There are no tables to display.
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
