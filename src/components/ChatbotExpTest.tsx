"use client";
import { useState } from "react";
import { AiOutlineReload } from "react-icons/ai";

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
					| { field: string; message: string }
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
	const [selectedTables, setSelectedTables] = useState<string[]>([]);
	const [selectedTable, setSelectedTable] = useState<string | null>(null);
	const [tableColumns, setTableColumns] = useState<string[]>([]);
	const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
	const [selectedColumn, setSelectedColumn] = useState<string>("");
	const [datatype, setDatatype] = useState<string>("");
	const [aggregateFunction, setAggregateFunction] = useState<string>("");
	const [aggregateFunctionColumnName, setAggregateFunctionColumnName] =
		useState<string>("");
	const [datatypes, setDatatypes] = useState<string[]>([]);
	const [x, setX] = useState<boolean>(false);
	const [orderBy, setOrderBy] = useState<boolean>(false);
	const [isDESC, setIsDESC] = useState<boolean>(false);
	const [orderByColumnName, setOrderByColumnName] = useState<string>("");
	const [groupBy, setGroupBy] = useState<boolean>(false);
	const [groupByColumnName, setGroupByColumnName] = useState<string>("");
	const [columnValues, setColumnValues] = useState<Record<string, string>>({});
	const [condition, setCondition] = useState<boolean>(false);
	const [isDelete, setIsDelete] = useState<boolean>(false);
	const [createTable, setCreateTable] = useState<boolean>(false);
	const [conditions, setConditions] = useState([
		{ column: "", operator: "", value: "" },
	]);

	const [conversationHistory, setConversationHistory] = useState<
		{ question: string; answer: string }[]
	>([]);

	const [conditionLogic, setConditionLogic] = useState<string>("AND");

	type Condition = {
		column: string;
		operator: string;
		value: string;
	};

	const handleConditionChange = (
		index: number,
		field: keyof Condition,
		value: string,
	): void => {
		const updatedConditions = [...conditions];
		updatedConditions[index][field] = value;
		setConditions(updatedConditions);
	};

	const addCondition = (): void => {
		setConditions([...conditions, { column: "", operator: "", value: "" }]);
	};

	const removeCondition = (index: number): void => {
		const updatedConditions = conditions.filter((_, i) => i !== index);
		setConditions(updatedConditions);
	};

	const [tableName, setTableName] = useState("my_table");
	const [columns, setColumns] = useState([{ name: "", type: "" }]);
	const columnTypes = ["INTEGER", "VARCHAR", "DATE", "BOOLEAN"];

	const handleAddColumn = () => {
		setColumns([...columns, { name: "", type: "" }]);
	};

	const handleTableNameChange = (value: string) => {
		setTableName(value);
	};

	const handleCreateColumnChange = (
		index: number,
		field: string,
		value: any,
	) => {
		const newColumns = columns.map((col, i) =>
			i === index ? { ...col, [field]: value } : col,
		);
		setColumns(newColumns);
	};

	const handleAnswer = async (answer: string) => {
		// إضافة السؤال والإجابة إلى محادثة التاريخ
		setConversationHistory((prev) => [...prev, { question, answer }]);

		if (["min", "max", "sum", "avg", "count"].includes(answer)) {
			setAggregateFunction(answer);
		}
		const result = await ChatbotExpAction(question, answer);

		if ("answer" in result && "message" in result && "fun" in result) {
			if (result.answer.includes("ORDER BY")) setOrderBy(true);
			if (result.answer.includes("GROUP BY")) setGroupBy(true);
			if (result.answer.includes("where")) setCondition(true);
			if (result.answer.includes("DELETE FROM")) setIsDelete(true);
			const resolvedFun = await result.fun;
			if (typeof resolvedFun === "object" && !Array.isArray(resolvedFun)) {
				const tableNames = Object.keys(resolvedFun);
				setExtraOptions(tableNames);
				setSyntax(result.answer);
				setEndMessage("");
			} else if (Array.isArray(resolvedFun)) {
				setExtraOptions(resolvedFun);
				setSyntax(result.answer);
			} else {
				setEndMessage("Unexpected data structure from result.fun");
			}
		} else if ("answer" in result) {
			if (result.answer.includes("CREATE")) setCreateTable(true);
			setSyntax("Generated Syntax: " + result.answer);
			setEndMessage("");
		} else if ("question" in result && "answers" in result) {
			setQuestion(result.question);
			setOptions(result.answers);
			setExtraOptions([]);
		} else {
			setEndMessage(result.message || "Failed to process the answer.");
		}
	};

	const handleTableSelection = async (table: string) => {
		setSelectedTable(table);

		if (!table) {
			console.error("Table name is empty.");
			setTableColumns([]);
			setSelectedColumns([]);
			setSelectedColumn("");
			return;
		}

		try {
			const response = await fetch("/api/getContext", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ tableName: table }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error("Error fetching columns:", errorData.error);
				setTableColumns([]);
				return;
			}
			const { columns } = await response.json();
			if (Array.isArray(columns)) {
				setTableColumns(columns);
			} else {
				console.error(`Invalid columns data for table "${table}".`);
				setTableColumns([]);
			}
		} catch (error) {
			console.error("Error fetching table columns:", error);
			setTableColumns([]);
		}
		setSelectedColumns([]);
		setSelectedColumn("");
	};

	const handleTablesSelection = async (table: string) => {
		setSelectedTables((prev) =>
			prev.includes(table) ? prev.filter((t) => t !== table) : [...prev, table],
		);

		try {
			const updatedTables = selectedTables.includes(table)
				? selectedTables.filter((t) => t !== table)
				: [...selectedTables, table];

			const columnPromises = updatedTables.map(async (selectedTable) => {
				const response = await fetch("/api/getContext", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ tableName: selectedTable }),
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error(
						`Error fetching columns for table "${selectedTable}":`,
						errorData.error,
					);
					return [];
				}

				const { columns } = await response.json();
				return Array.isArray(columns) ? columns : [];
			});

			const allColumns = (await Promise.all(columnPromises)).flat();
			setTableColumns(allColumns);
		} catch (error) {
			console.error("Error fetching table columns:", error);
			setTableColumns([]);
		}

		setSelectedColumns([]);
		setSelectedColumn("");
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
		if (
			!(selectedTable || selectedTables) ||
			(selectedColumns.length === 0 && !selectedColumn)
		) {
			alert("Please select a table and at least one column.");
			return;
		}
		const updateStatements = selectedColumns.map((column) => {
			if (column.length == 0) return;
			const value = columnValues[column] || "";
			return `${column} = ${value}`;
		});
		const finalCondition = conditions
			.map((cond) => `${cond.column} ${cond.operator} '${cond.value}'`)
			.join(` ${conditionLogic} `);

		const sqlQuery = syntax
			.replace("{table_name}", selectedTable ? selectedTable.split(":")[0] : "")
			.replace("|table_name|", selectedTables.join(", "))
			.replace("{[column_name]}", selectedColumns.join(", "))
			.replace("({[column_name]})", "(" + selectedColumns.join(", ") + ")")
			.replace("{column_name}", selectedColumn)
			.replace("{column_name_GROUP_BY}", groupByColumnName)
			.replace("{column_name_ORDER_BY}", orderByColumnName)
			.replace("{ASC|DESC}", isDESC ? "DESC" : "ASC")
			.replace("{datatype}", datatype)
			.replace(
				"|agg|",
				aggregateFunction +
					"(" +
					aggregateFunctionColumnName +
					")" +
					selectedColumns
					? aggregateFunctionColumnName
						? ", "
						: ""
					: "",
			)
			.replace("{[datatype]}", datatypes.join(", "))
			.replace("{[column_name = value]}", updateStatements.join(", "))
			.replace(
				"{[value]}",
				"(" +
					selectedColumns.map((col) => columnValues[col] || "").join(", ") +
					")",
			)
			.replace("|condition|", finalCondition)
			.replace("[table_name]", tableName)
			.replace(
				"{[column_name datatype]}",
				columns.map((col) => `${col.name} ${col.type}`).join(", "),
			);
		setSyntax(sqlQuery);
		setEndMessage("SQL query generated successfully.");
	};

	const generateCreateTableSQL = () => {
		const sqlQuery = syntax
			.replace("[table_name]", tableName)
			.replace(
				"{[column_name datatype]}",
				columns.map((col) => `${col.name} ${col.type}`).join(", "),
			);
		setSyntax(sqlQuery);
		setEndMessage("SQL query generated successfully.");
	};

	const generateDeleteSQL = () => {
		const finalCondition = conditions
			.map((cond) => `${cond.column} ${cond.operator} '${cond.value}'`)
			.join(` ${conditionLogic} `);
		const sqlQuery = syntax
			.replace("{table_name}", selectedTable ? selectedTable.split(":")[0] : "")
			.replace("|condition|", finalCondition);
		setSyntax(sqlQuery);
		setEndMessage("SQL query generated successfully.");
	};

	const handleColumnChange = (column: string, value: string) => {
		setColumnValues((prev) => ({
			...prev,
			[column]: value,
		}));
	};

	const resetAll = () => {
		setQuestion("What kind of instructions do you want?");
		setOptions(["dml", "ddl"]);
		setEndMessage("");
		setSyntax("");
		setExtraOptions([]);
		setSelectedTables([]);
		setSelectedTable(null);
		setTableColumns([]);
		setSelectedColumns([]);
		setSelectedColumn("");
		setDatatype("");
		setAggregateFunction("");
		setAggregateFunctionColumnName("");
		setDatatypes([]);
		setX(false);
		setOrderBy(false);
		setIsDESC(false);
		setOrderByColumnName("");
		setGroupBy(false);
		setGroupByColumnName("");
		setColumnValues({});
		setCondition(false);
		setCreateTable(false);
		setConditions([{ column: "", operator: "", value: "" }]);
		setConditionLogic("AND");
		setTableName("my_table");
		setColumns([{ name: "", type: "" }]);
		setConversationHistory([]); // إفراغ المحادثة
	};
	return (
		<div
			className="relative flex flex-col space-y-4 bg-[#00203F] p-4 text-white"
			style={{
				maxHeight: "65vh",
				overflowY: "auto",
				scrollbarWidth: "none", // لإخفاء شريط التمرير في Firefox
				msOverflowStyle: "none", // لإخفاء شريط التمرير في Internet Explorer و Edge
			}}
		>
			<div className="max-h-[40vh] overflow-y-auto">
				{conversationHistory.map((msg, index) => (
					<div key={index} className="mb-2 rounded-lg bg-[#ADF0D1] p-2">
						<p className="text-gray-700">You: {msg.question}</p>
						<p className="text-black">Bot: {msg.answer}</p>
					</div>
				))}
			</div>

			<h1 className="text-2xl font-semibold">{question}</h1>
			<ul className="space-y-2">
				{options.map((option, index) => (
					<li key={index}>
						<button
							className="w-full rounded-md bg-[#ADF0D1] p-2 hover:bg-[#00203F] hover:text-white"
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
								{syntax.includes("|table_name|") ? (
									<>
										<label className="flex items-center space-x-2">
											<input
												type="checkbox"
												checked={selectedTables.includes(extraOption)}
												onChange={() => handleTablesSelection(extraOption)}
												className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
											/>
											<span>{extraOption}</span>
										</label>
									</>
								) : (
									<button
										className="w-full rounded-md bg-green-500 py-2 text-white transition duration-200 hover:bg-green-600"
										onClick={() => handleTableSelection(extraOption)}
									>
										{extraOption}
									</button>
								)}
							</li>
						))}
						{/* زر لتأكيد التحديد */}
						{syntax.includes("|table_name|") && selectedTables.length > 0 && (
							<div className="mt-4">
								<button
									className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
									onClick={() => {
										setX(true);
									}}
								>
									Confirm Selection
								</button>
							</div>
						)}
					</ul>
				</div>
			)}
			{extraOptions.length > 0 && groupBy && (selectedTable || x) && (
				<div className="mt-4">
					<p className="mb-2 font-medium text-gray-700">
						Select column for GROUP BY:
					</p>
					<select
						className="w-full rounded-md border-gray-300 p-2 text-gray-800 focus:ring-blue-400"
						value={groupByColumnName}
						onChange={(e) => setGroupByColumnName(e.target.value)}
					>
						<option value="">Select a column</option>
						{tableColumns.map((column, index) => (
							<option key={index} value={column}>
								{column}
							</option>
						))}
					</select>
				</div>
			)}
			{extraOptions.length > 0 && orderBy && (selectedTable || x) && (
				<div className="mt-4">
					<p className="mb-2 font-medium text-gray-700">
						Select column for ORDER BY:
					</p>
					<div className="flex items-center space-x-2">
						<select
							className="w-full rounded-md border-gray-300 p-2 text-gray-800 focus:ring-blue-400"
							value={orderByColumnName}
							onChange={(e) => setOrderByColumnName(e.target.value)}
						>
							<option value="">Select a column</option>
							{tableColumns.map((column, index) => (
								<option key={index} value={column}>
									{column}
								</option>
							))}
						</select>
						<select
							className="w-32 rounded-md border-gray-300 p-2 text-gray-800 focus:ring-blue-400"
							value={isDESC ? "DESC" : "ASC"}
							onChange={(e) => setIsDESC(e.target.value === "DESC")}
						>
							<option value="ASC">ASC</option>
							<option value="DESC">DESC</option>
						</select>
					</div>
				</div>
			)}
			{extraOptions.length > 0 && aggregateFunction && (selectedTable || x) && (
				<div className="mt-4">
					<p className="mb-2 font-medium text-gray-700">
						Select column for {aggregateFunction.toUpperCase()} function:
					</p>
					<select
						value={aggregateFunctionColumnName}
						onChange={(e) => setAggregateFunctionColumnName(e.target.value)}
						className="w-full rounded-md border-gray-300 p-2 text-gray-800"
					>
						<option value="" disabled>
							Select a column
						</option>
						{tableColumns.map((column, index) => (
							<option key={index} value={column}>
								{column}
							</option>
						))}
					</select>
				</div>
			)}
			{/* واجهة لإنشاء شروط */}
			{!endMessage && condition && (selectedTable || x) && (
				<div className="mt-4 space-y-4">
					<p className="mb-2 font-medium text-gray-700">Define conditions:</p>

					{/* قائمة الشروط */}
					{conditions.map((cond, index) => (
						<div key={index} className="flex items-center space-x-4">
							{/* اختيار العمود */}
							<select
								value={cond.column}
								onChange={(e) =>
									handleConditionChange(index, "column", e.target.value)
								}
								className="rounded border-gray-300 p-2 focus:ring-blue-400"
							>
								<option value="" disabled>
									Select column
								</option>
								{tableColumns.map((column, i) => (
									<option key={i} value={column}>
										{column}
									</option>
								))}
							</select>

							{/* اختيار العملية */}
							<select
								value={cond.operator}
								onChange={(e) =>
									handleConditionChange(index, "operator", e.target.value)
								}
								className="rounded border-gray-300 p-2 focus:ring-blue-400"
							>
								<option value="" disabled>
									Select operator
								</option>
								{[">", "<", ">=", "<=", "=", "!="].map((op, i) => (
									<option key={i} value={op}>
										{op}
									</option>
								))}
							</select>

							{/* إدخال القيمة */}
							<input
								type="text"
								value={cond.value}
								onChange={(e) =>
									handleConditionChange(index, "value", e.target.value)
								}
								placeholder="Enter value"
								className="rounded border-gray-300 p-2 focus:ring-blue-400"
							/>

							{/* إزالة الشرط */}
							{index > 0 && (
								<button
									type="button"
									onClick={() => removeCondition(index)}
									className="text-red-500 hover:underline"
								>
									Remove
								</button>
							)}
						</div>
					))}

					{/* اختيار العملية بين الشروط */}
					{conditions.length > 1 && (
						<div className="mt-2">
							<select
								value={conditionLogic}
								onChange={(e) => setConditionLogic(e.target.value)}
								className="rounded border-gray-300 p-2 focus:ring-blue-400"
							>
								<option value="AND">AND</option>
								<option value="OR">OR</option>
							</select>
						</div>
					)}

					{/* إضافة شرط جديد */}
					<button
						type="button"
						onClick={addCondition}
						className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					>
						Add Another Condition
					</button>
				</div>
			)}
			{/* عرض الأعمدة كـ Checkboxes أو RadioButtons */}
			{!endMessage &&
				(selectedTable || x) &&
				tableColumns.length > 0 &&
				!isDelete && (
					<div className="mt-4">
						<p className="mb-2 font-medium text-gray-700">
							{/* Select columns from {selectedTable.split(":")[0]}: */}s
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
			{!endMessage && selectedTable && isDelete && (
				<button
					className="mt-4 w-full rounded-md bg-purple-500 py-2 text-white transition duration-200 hover:bg-purple-600"
					onClick={generateDeleteSQL}
				>
					Generate SQL Query
				</button>
			)}
			{!endMessage && createTable && (
				<div className="rounded-lg bg-gray-100 p-6 shadow-md">
					<div className="mb-4">
						<label
							htmlFor="tableName"
							className="mb-2 block text-sm font-medium text-gray-700"
						>
							Table Name:
						</label>
						<input
							type="text"
							id="tableName"
							name="tableName"
							placeholder="Enter the table name"
							onChange={(e) => handleTableNameChange(e.target.value)}
							className="w-full rounded-md border border-gray-300 p-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
						/>
					</div>

					{columns.map((col, index) => (
						<div key={index} className="mb-4">
							<div className="mb-2">
								<label
									htmlFor={`columnName${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									Column Name:
								</label>
								<input
									type="text"
									id={`columnName${index}`}
									value={col.name}
									onChange={(e) =>
										handleCreateColumnChange(index, "name", e.target.value)
									}
									placeholder="Enter the column name"
									className="w-full rounded-md border border-gray-300 p-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>
							<div>
								<label
									htmlFor={`columnType${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									Column Type:
								</label>
								<select
									id={`columnType${index}`}
									value={col.type}
									onChange={(e) =>
										handleCreateColumnChange(index, "type", e.target.value)
									}
									className="w-full rounded-md border border-gray-300 p-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option value="">Select column type</option>
									{columnTypes.map((type, i) => (
										<option key={i} value={type}>
											{type}
										</option>
									))}
								</select>
							</div>
						</div>
					))}

					<div className="flex space-x-4">
						<button
							type="button"
							onClick={handleAddColumn}
							className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							New Column
						</button>
						<button
							className="rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
							onClick={generateCreateTableSQL}
						>
							Generate SQL Query
						</button>
					</div>
				</div>
			)}
			{/* عرض الرسالة النهائية */}
			{endMessage && (
				<div className="mt-4 rounded-lg bg-[#00203F] p-4">
					<p className="text-white">{syntax}</p>
					<p className="text-white">{endMessage}</p>
					<button
						className="ml-2 text-[#ADF0D1] hover:text-white"
						onClick={() => navigator.clipboard.writeText(syntax)}
					>
						Copy
					</button>
				</div>
			)}
			<button
				type="button"
				onClick={resetAll}
				className="fixed bottom-4 right-4 rounded-full bg-[#ADF0D1] p-3 hover:bg-[#00203F] hover:text-white"
			>
				<AiOutlineReload />
			</button>
		</div>
	);
}
