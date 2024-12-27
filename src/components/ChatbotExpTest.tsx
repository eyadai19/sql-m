"use client";
import { useState } from "react";

export default function ChatbotExpTest({
	ChatbotExpAction,
}: {
	ChatbotExpAction: (
		question: string,
		answer: string,
	) => Promise<
		| { answer: string }
		| {
				answer: string;
				message: string;
				fun: Promise<
					| string[]
					| Record<string, string[]>
					| {
							field: string;
							message: string;
					  }
					| undefined
				>;
		  }
		| { question: string; answers: string[] }
		| { field: string; message: string }
	>;
}) {
	const [question, setQuestion] = useState<string>(
		"What kind of instructions do you want?",
	);
	const [options, setOptions] = useState<string[]>(["dml", "ddl"]);
	const [endMessage, setEndMessage] = useState<string>("");
	const [syntax, setSyntax] = useState<string>("");
	const [extraOptions, setExtraOptions] = useState<string[]>([]);
	const [extraOptionsColumns, setExtraOptionsColumns] = useState<
		| string[]
		| Record<string, string[]>
		| {
				field: string;
				message: string;
		  }
		| undefined
	>();
	const [selectedTable, setSelectedTable] = useState<string | null>(null);
	const [tableColumns, setTableColumns] = useState<string[]>([]);
	const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
	const [selectedColumn, setSelectedColumn] = useState<string>("");
	const [datatype, setDatatype] = useState<string>("");
	const [datatypes, setDatatypes] = useState<string[]>([]);
	const [updateColumnAndData, setUpdateColumnAndData] = useState<string[]>([]);
	const [columnValues, setColumnValues] = useState<Record<string, string>>({});

	const handleAnswer = async (answer: string) => {
		const result = await ChatbotExpAction(question, answer);

		if ("answer" in result && "message" in result && "fun" in result) {
			const resolvedFun = await result.fun;
			if (typeof resolvedFun === "object" && !Array.isArray(resolvedFun)) {
				const tableNames = Object.keys(resolvedFun);
				setExtraOptions(tableNames);
				setExtraOptionsColumns(resolvedFun);
				setSyntax(result.answer);
				setEndMessage("");
			} else if (Array.isArray(resolvedFun)) {
				setExtraOptions(resolvedFun);
				setSyntax(result.answer);
			} else {
				setEndMessage("Unexpected data structure from result.fun");
			}
		} else if ("answer" in result) {
			setSyntax("Generated Syntax: " + result.answer);
			setEndMessage("End of questions");
		} else if ("question" in result && "answers" in result) {
			setQuestion(result.question);
			setOptions(result.answers);
			setExtraOptions([]); // Reset extra options
		} else {
			setEndMessage(result.message || "Failed to process the answer.");
		}
	};

	const handleTableSelection = (table: string) => {
		setSelectedTable(table);
		let tableData: any;

		if (!extraOptionsColumns) return;

		// تحقق إذا كانت extraOptionsColumns من نوع Record<string, string[]>
		if (
			typeof extraOptionsColumns === "object" &&
			!Array.isArray(extraOptionsColumns) &&
			extraOptionsColumns !== null
		) {
			// الوصول إلى بيانات الجدول
			tableData =
				extraOptionsColumns[table as keyof typeof extraOptionsColumns];

			// إذا كانت tableData من نوع string، قم بتحويلها إلى مصفوفة
			if (typeof tableData === "string") {
				tableData = [tableData];
			}

			if (Array.isArray(tableData)) {
				setTableColumns(tableData); // تحديث الأعمدة الخاصة بالـ table المحدد
			} else {
				console.error(`Table "${table}" not found in extraOptionsColumns.`);
				setTableColumns([]); // إعادة تعيين الأعمدة في حالة عدم وجودها
			}
		} else {
			console.error("Invalid data format for extraOptionsColumns.");
			setTableColumns([]); // إعادة تعيين الأعمدة إذا كانت البيانات غير صحيحة
		}

		setSelectedColumns([]); // إعادة تعيين الأعمدة المحددة
		setSelectedColumn(""); // إعادة تعيين العمود المحدد
	};

	const toggleColumnSelection = (column: string) => {
		setSelectedColumns((prev) =>
			prev.includes(column)
				? prev.filter((col) => col !== column)
				: [...prev, column],
		);
	};

	const handleColumnSelection = (column: string) => {
		setSelectedColumn(column);
	};

	const generateSQL = () => {
		if (!selectedTable || (selectedColumns.length === 0 && !selectedColumn)) {
			alert("Please select a table and at least one column.");
			return;
		}
		const updateStatements = selectedColumns.map((column) => {
			if (column.length == 0) return;
			const value = columnValues[column] || "";
			return `${column} = ${value}`;
		});
		const tableName = selectedTable.split(":")[0];
		const sqlQuery = syntax
			.replace("{table_name}", tableName)
			.replace("{[column_name]}", selectedColumns.join(", "))
			.replace("({[column_name]})", "(" + selectedColumns.join(", ") + ")")
			.replace("{column_name}", selectedColumn)
			.replace("{datatype}", datatype)
			.replace("{[datatype]}", datatypes.join(", "))
			.replace("{[column_name = value]}", updateStatements.join(", "))
			.replace(
				"{[value]}",
				"(" +
					selectedColumns.map((col) => columnValues[col] || "").join(", ") +
					")",
			);
		//{[column_name datatype]}
		setSyntax(sqlQuery);
		setEndMessage("SQL query generated successfully.");
	};

	const handleColumnChange = (column: string, value: string) => {
		setColumnValues((prev) => ({
			...prev,
			[column]: value,
		}));
	};
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h1 className="mb-4 text-2xl font-semibold text-gray-800">
					{question}
				</h1>

				<ul className="space-y-4">
					{options.map((option, index) => (
						<li key={index}>
							<button
								className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
								onClick={() => handleAnswer(option)}
							>
								{option}
							</button>
						</li>
					))}
				</ul>

				{/* عرض خيارات الجداول */}
				{extraOptions.length > 0 && !selectedTable && (
					<div className="mt-4">
						<p className="mb-2 font-medium text-gray-700">
							Please choose a table:
						</p>
						<ul className="space-y-4">
							{extraOptions.map((extraOption, index) => (
								<li key={index}>
									<button
										className="w-full rounded-md bg-green-500 py-2 text-white transition duration-200 hover:bg-green-600"
										onClick={() => handleTableSelection(extraOption)}
									>
										{extraOption}
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
				
				{/* عرض الأعمدة كـ Checkboxes أو RadioButtons */}
				{!endMessage && selectedTable && tableColumns.length > 0 && (
					<div className="mt-4">
						<p className="mb-2 font-medium text-gray-700">
							Select columns from {selectedTable.split(":")[0]}:
						</p>
						<div className="space-y-2">
							{syntax.includes("[")
								? // إذا كان الجواب يحتوي على "[" استخدم Checkboxes
									tableColumns.map((column, index) => (
										<label
											key={index}
											className="flex items-center space-x-2 text-gray-800"
										>
											<input
												type="checkbox"
												value={column}
												onChange={() => toggleColumnSelection(column)}
												className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
											/>
											<span>{column}</span>
											{(syntax.startsWith("UPDATE") ||
												syntax.startsWith("INSERT")) && (
												<input
													type="text"
													placeholder="Enter value"
													value={columnValues[column] || ""}
													onChange={(e) =>
														handleColumnChange(column, e.target.value)
													}
													className="ml-2 w-32 rounded-md border-gray-300 p-1 text-gray-800 focus:ring-blue-400"
												/>
											)}
										</label>
									))
								: // إذا لم يحتوي الجواب على "[" استخدم RadioButtons
									tableColumns.map((column, index) => (
										<label
											key={index}
											className="flex items-center space-x-2 text-gray-800"
										>
											<input
												type="radio"
												name="column"
												value={column}
												onChange={() => handleColumnSelection(column)}
												className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
											/>
											<span>{column}</span>
											{(syntax.startsWith("UPDATE") ||
												syntax.startsWith("INSERT")) && (
												<input
													type="text"
													placeholder="Enter value"
													value={columnValues[column] || ""}
													onChange={(e) =>
														handleColumnChange(column, e.target.value)
													}
													className="ml-2 w-32 rounded-md border-gray-300 p-1 text-gray-800 focus:ring-blue-400"
												/>
											)}
										</label>
									))}
						</div>
						<button
							className="mt-4 w-full rounded-md bg-purple-500 py-2 text-white transition duration-200 hover:bg-purple-600"
							onClick={generateSQL}
						>
							Generate SQL Query
						</button>
					</div>
				)}

				{/* عرض الرسالة النهائية */}
				{endMessage && (
					<p className="mt-4 text-center font-medium text-red-500">
						{syntax}
						<br />
						{endMessage}
					</p>
				)}
			</div>
		</div>
	);
}
