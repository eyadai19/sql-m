"use client";
import { userDbApi } from "@/utils/apis";
import { useEffect, useRef, useState } from "react"; // Import useRef
import {
	AiOutlineClose,
	AiOutlineCode,
	AiOutlineCopy,
	AiOutlineReload,
} from "react-icons/ai";

interface Condition {
	column: string;
	operator: string;
	value: string;
}
interface QueryResult {
	[key: string]: string | number | boolean | null | undefined;
}
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
	const [tableName, setTableName] = useState("my_table");
	const [columns, setColumns] = useState([{ name: "", type: "" }]);
	const columnTypes = ["INTEGER", "VARCHAR", "DATE", "BOOLEAN"];
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isAddColumn, setIsAddColumn] = useState<boolean>(false);
	const [isDropMode, setIsDropMode] = useState<boolean>(false);
	const [selectResults, setSelectResults] = useState<QueryResult[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const chatContainerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [conversationHistory]);

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
		setIsLoading(true);

		setConversationHistory((prev) => [...prev, { question, answer }]);

		if (["min", "max", "sum", "avg", "count"].includes(answer)) {
			setAggregateFunction(answer);
		}
		const result = await ChatbotExpAction(question, answer);

		if ("answer" in result && "message" in result && "fun" in result) {
			if (result.answer == "DROP table {table_name}") setIsDropMode(true);
			if (result.answer.includes("ORDER BY")) setOrderBy(true);
			if (result.answer.includes("GROUP BY")) setGroupBy(true);
			if (result.answer.includes("where")) setCondition(true);
			if (result.answer.includes("DELETE FROM")) setIsDelete(true);
			if (result.answer.includes("ALTER") && result.answer.includes("ADD"))
				setIsAddColumn(true);
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
			setSyntax(result.answer);
			setEndMessage("");
		} else if ("question" in result && "answers" in result) {
			setQuestion(result.question);
			setOptions(result.answers);
			setExtraOptions([]);
		} else {
			setEndMessage(result.message || "Failed to process the answer.");
		}

		setIsLoading(false);

		if (!result.question) {
			setIsModalOpen(true);
		}
	};

	const handleTableSelection = async (table: string) => {
		setSelectedTable(table);

		if (!table) {
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

	const handleAggColumnSelection = (column: string) => {
		setAggregateFunctionColumnName(column);
	};

	const generateSQL = () => {
		if (
			!(selectedTable || selectedTables) ||
			(selectedColumns.length === 0 && !selectedColumn)
		) {
			if (!aggregateFunction) {
				alert("Please select a table and at least one column.");
				return;
			}
		}
		const updateStatements = selectedColumns.map((column) => {
			if (column.length == 0) return;
			const value = columnValues[column] || "";
			return `${column} = ${value}`;
		});
		const finalCondition = conditions
			.map((cond) => `${cond.column} ${cond.operator} '${cond.value}'`)
			.join(` ${conditionLogic} `);
		const agg = aggregateFunction + "(" + aggregateFunctionColumnName + ")";
		const semiColm = selectedColumns.length == 0 ? "" : ",";

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
			.replace("|agg|", agg + semiColm)
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

	const generateDropTableSQL = (table: string) => {
		const sqlQuery = syntax.replace("{table_name}", table);
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

	const generateAddColumnSQL = () => {
		if (!selectedTable || !columns[0].name || !columns[0].type) {
			alert("Please select a table and provide a column name and type.");
			return;
		}

		const sqlQuery = syntax
			.replace("{table_name}", selectedTable.split(":")[0])
			.replace("{column_name}", columns[0].name)
			.replace("{datatype}", columns[0].type);

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
		setConversationHistory([]);
		setIsModalOpen(false);
		setIsAddColumn(false);
		setIsDropMode(false);
		setSelectResults([]);
		setErrorMessage(null);
	};

	const validateAndSelectData = async () => {
		setSelectResults([]);
		setErrorMessage(null);

		try {
			const response = await fetch(userDbApi, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					query: syntax, // استخدام الاستعلام الحالي
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(
					`${errorData.error} \n ${errorData.originalError}` ||
						"Error executing query.",
				);
				return;
			}

			const data = await response.json();

			if (!data.data || data.data.length === 0) {
				setErrorMessage("No data found for the given query.");
				setSelectResults([]);
			} else {
				setSelectResults(data.data);
			}
		} catch (error) {
			console.error("Error executing query:", error);
			setErrorMessage("An error occurred while executing the query.");
		}
	};

	const autoResize = (element: HTMLTextAreaElement) => {
		element.style.height = "auto"; // إعادة تعيين الارتفاع
		element.style.height = `${element.scrollHeight}px`; // تعيين الارتفاع الجديد
	};

	return (
		<div
			className="relative flex flex-col space-y-4 bg-[#00203F] p-4 text-white"
			style={{
				maxHeight: "65vh",
				overflowY: "auto",
				scrollbarWidth: "none",
				msOverflowStyle: "none",
			}}
		>
			{endMessage ? (
				<div className="mt-20 rounded-lg bg-gray-400 p-6 text-white shadow-2xl">
					<div className="mb-4 rounded-md bg-[#1E2A38] p-4 font-mono text-sm">
						{/* <pre className="whitespace-pre-wrap break-words">{syntax}</pre> */}
						<textarea
							className="resize-none overflow-hidden whitespace-pre-wrap break-words rounded-lg bg-[#D3D3D3] p-3 text-sm text-[#00203F] shadow-sm"
							value={syntax}
							onChange={(e) => {
								setSyntax(e.target.value);
								autoResize(e.target);
							}}
							ref={(textarea) => {
								if (textarea) {
									textarea.style.height = "auto";
									textarea.style.height = `${textarea.scrollHeight}px`;
								}
							}}
							rows={1}
						/>
					</div>
					<div className="flex flex-wrap justify-center gap-4">
						<button
							className="flex items-center rounded-md bg-[#ADF0D1] px-4 py-2 text-[#00203F] transition-all duration-300 hover:bg-[#00203F] hover:text-white hover:shadow-lg"
							onClick={() => navigator.clipboard.writeText(syntax)}
						>
							<AiOutlineCopy className="mr-2" />
							Copy
						</button>
						{/* زر Run */}
						{syntax.toUpperCase().startsWith("SELECT") && (
							<button
								className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
								onClick={validateAndSelectData}
							>
								<AiOutlineCode className="mr-2" />
								Run
							</button>
						)}
						<button
							className="flex items-center rounded-md bg-red-500 px-4 py-2 text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg"
							onClick={resetAll}
						>
							<AiOutlineClose className="mr-2" />
							Close
						</button>
					</div>
					{selectResults.length > 0 &&
						Object.keys(selectResults[0]).length > 0 && (
							<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
								<div className="relative max-h-[90vh] w-11/12 max-w-3xl overflow-hidden rounded-xl bg-white p-6 shadow-xl">
									<button
										onClick={() => setSelectResults([])}
										className="absolute right-4 top-4 text-2xl text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-gray-900"
									>
										&times;
									</button>
									<h3 className="mb-6 text-2xl font-bold text-gray-800">
										Query Results
									</h3>
									<div className="overflow-x-auto">
										<table className="w-full border-collapse rounded-lg bg-white shadow">
											<thead>
												<tr className="bg-gray-200 text-gray-700">
													{Object.keys(selectResults[0]).map((key, index) => (
														<th
															key={index}
															className="border-b-2 border-gray-300 px-4 py-3 text-left text-sm font-semibold"
														>
															{key}
														</th>
													))}
												</tr>
											</thead>
											<tbody>
												{selectResults.map((row, rowIndex) => (
													<tr
														key={rowIndex}
														className={`transition-colors duration-200 ${
															rowIndex % 2 === 0
																? "bg-gray-50 hover:bg-gray-100"
																: "bg-white hover:bg-gray-50"
														}`}
													>
														{Object.values(row).map((value, colIndex) => (
															<td
																key={colIndex}
																className="border-t border-gray-200 px-4 py-2 text-sm text-gray-700"
															>
																{value != null ? String(value) : "-"}
															</td>
														))}
													</tr>
												))}
												{errorMessage && (
													<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
														<div className="relative w-11/12 max-w-lg overflow-hidden rounded-xl bg-white p-6 shadow-xl">
															<button
																onClick={() => setErrorMessage(null)}
																className="absolute right-4 top-4 text-2xl text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-gray-900"
															>
																&times;
															</button>
															<h3 className="mb-4 text-xl font-bold text-red-600">
																Error
															</h3>
															<div className="max-h-[60vh] overflow-y-auto rounded-lg bg-red-100 p-4 text-red-700">
																<pre className="whitespace-pre-wrap font-mono text-sm">
																	{errorMessage}
																</pre>
															</div>
															<div className="mt-6 flex justify-end">
																<button
																	className="rounded-md bg-red-500 px-6 py-2 text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg"
																	onClick={() => setErrorMessage(null)}
																>
																	Close
																</button>
															</div>
														</div>
													</div>
												)}
											</tbody>
										</table>
									</div>
									<div className="mt-6 flex justify-end">
										<button
											className="rounded-md bg-[#ADF0D1] px-6 py-2 text-white shadow-md transition-all duration-200 hover:bg-[#A1E7D8] hover:shadow-lg"
											onClick={() => setSelectResults([])}
										>
											Close
										</button>
									</div>
								</div>
							</div>
						)}
					{/* عرض رسالة الخطأ */}
					{errorMessage && (
						<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
							<div className="relative w-11/12 max-w-lg overflow-hidden rounded-xl bg-white p-6 shadow-xl">
								<button
									onClick={() => setErrorMessage(null)}
									className="absolute right-4 top-4 text-2xl text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-gray-900"
								>
									&times;
								</button>
								<h3 className="mb-4 text-xl font-bold text-red-600">Error</h3>
								<div className="max-h-[60vh] overflow-y-auto rounded-lg bg-red-100 p-4 text-red-700">
									<pre className="whitespace-pre-wrap font-mono text-sm">
										{errorMessage}
									</pre>
								</div>
								<div className="mt-6 flex justify-end">
									<button
										className="rounded-md bg-red-500 px-6 py-2 text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg"
										onClick={() => setErrorMessage(null)}
									>
										Close
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			) : (
				<>
					<div
						ref={chatContainerRef} // Attach the ref to the scrollable container
						className="max-h-[65vh] overflow-y-auto"
						style={{
							maxHeight: "70vh",
							overflowY: "auto",
							scrollbarWidth: "none",
							msOverflowStyle: "none",
						}}
					>
						{/* عرض المحادثة */}
						<div>
							{conversationHistory.map((msg, index) => (
								<div key={index} className="mb-2 flex flex-col space-y-2">
									<div className="flex justify-end">
										<div className="rounded-lg bg-[#ADF0D1] p-2">
											<p className="text-gray-700"> {msg.question}</p>
										</div>
									</div>
									<div className="flex justify-start">
										<div className="rounded-lg bg-[#ffffff] p-2">
											<p className="text-black"> {msg.answer}</p>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* إضافة السؤال والخيارات كجزء من المحادثة */}
						<div className="flex flex-col space-y-2">
							{question && isLoading ? (
								<div className="mb-4 h-12 rounded bg-[#D1E8FF] p-3">
									<div className="flex items-center justify-center">
										<div className="h-6 w-6 animate-spin rounded-full border-b-4 border-t-4 border-[#00203F]"></div>
									</div>
								</div>
							) : (
								<div className="justify-cented flex">
									<div className="mb-4 rounded-lg bg-[#D1E8FF] p-2">
										<p className="text-black">{question}</p>
									</div>
								</div>
							)}
						</div>

						{/* عرض الخيارات */}
						<div className="flex flex-col space-y-4">
							{options.map((option, index) => (
								<div key={index} className="flex justify-center">
									<button
										className={`hover:bg-gray300 w-full max-w-sm rounded-full bg-[#ADF0D1] px-4 py-2 text-center text-sm font-semibold text-[#00203F] transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-lg ${
											isLoading ? "cursor-not-allowed opacity-50" : ""
										}`}
										onClick={() => handleAnswer(option)}
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="flex items-center justify-center">
												<div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-[#00203F]"></div>
											</div>
										) : (
											option
										)}
									</button>
								</div>
							))}
						</div>
					</div>

					{/* شاشة منبثقة (Modal) */}
					{isModalOpen && (
						<div className="fixed inset-0 flex items-center justify-center bg-[#00203F] bg-opacity-80">
							<div
								className="max-h-[90vh] w-11/12 max-w-2xl overflow-y-auto rounded-lg bg-[#ADF0D1] p-6 shadow-lg"
								style={{
									maxHeight: "65vh",
									overflowY: "auto",
									scrollbarWidth: "none",
									msOverflowStyle: "none",
								}}
							>
								{/* زر الإغلاق */}
								<button
									onClick={() => setIsModalOpen(false)}
									className="absolute right-4 top-4 text-[#00203F] hover:text-[#00203F]"
								>
									&times;
								</button>

								{/* عرض خيارات الجداول */}
								{extraOptions.length > 0 &&
									!isDropMode &&
									!selectedTable &&
									!isAddColumn && (
										<div className="mt-4">
											<p className="mb-2 font-medium text-[#00203F]">
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
																		checked={selectedTables.includes(
																			extraOption,
																		)}
																		onChange={() =>
																			handleTablesSelection(extraOption)
																		}
																		className="rounded border-[#00203F] text-[#00203F] focus:ring-[#00203F]"
																	/>
																	<span className="text-[#00203F]">
																		{extraOption}
																	</span>
																</label>
															</>
														) : (
															<button
																className="w-full rounded-md bg-[#00203F] py-2 text-[#ADF0D1] transition duration-200 hover:bg-opacity-90"
																onClick={() =>
																	handleTableSelection(extraOption)
																}
															>
																{extraOption}
															</button>
														)}
													</li>
												))}
												{syntax.includes("|table_name|") &&
													selectedTables.length > 0 && (
														<div className="mt-4">
															<button
																className="w-full rounded-md bg-[#00203F] py-2 text-[#ADF0D1] transition duration-200 hover:bg-opacity-90"
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

								{/* اختيار عمود GROUP BY */}
								{extraOptions.length > 0 &&
									groupBy &&
									!isDropMode &&
									(selectedTable || x) &&
									!isAddColumn && (
										<div className="mt-4">
											<p className="mb-2 font-medium text-[#00203F]">
												Select column for GROUP BY:
											</p>
											<select
												className="w-full rounded-md border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
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

								{/* اختيار عمود ORDER BY */}
								{extraOptions.length > 0 &&
									orderBy &&
									!isDropMode &&
									(selectedTable || x) &&
									!isAddColumn && (
										<div className="mt-4">
											<p className="mb-2 font-medium text-[#00203F]">
												Select column for ORDER BY:
											</p>
											<div className="flex items-center space-x-2">
												<select
													className="w-full rounded-md border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
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
													className="w-32 rounded-md border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
													value={isDESC ? "DESC" : "ASC"}
													onChange={(e) => setIsDESC(e.target.value === "DESC")}
												>
													<option value="ASC">ASC</option>
													<option value="DESC">DESC</option>
												</select>
											</div>
										</div>
									)}

								{/* اختيار عمود Aggregate Function */}
								{extraOptions.length > 0 &&
									aggregateFunction &&
									!isDropMode &&
									(selectedTable || x) &&
									!isAddColumn && (
										<div className="mt-4">
											<p className="mb-2 font-medium text-[#00203F]">
												Select column for {aggregateFunction.toUpperCase()}{" "}
												function:
											</p>
											<select
												value={aggregateFunctionColumnName}
												onChange={(e) =>
													handleAggColumnSelection(e.target.value)
												}
												className="w-full rounded-md border-[#00203F] p-2 text-[#00203F]"
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

								{/* واجهة إنشاء الشروط */}
								{!endMessage &&
									condition &&
									!isDropMode &&
									(selectedTable || x) &&
									!isAddColumn && (
										<div className="mt-4 space-y-4">
											<p className="mb-2 font-medium text-[#00203F]">
												Define conditions:
											</p>

											{/* قائمة الشروط */}
											{conditions.map((cond, index) => (
												<div
													key={index}
													className="flex items-center space-x-4"
												>
													{/* اختيار العمود */}
													<select
														value={cond.column}
														onChange={(e) =>
															handleConditionChange(
																index,
																"column",
																e.target.value,
															)
														}
														className="rounded border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
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
															handleConditionChange(
																index,
																"operator",
																e.target.value,
															)
														}
														className="rounded border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
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
															handleConditionChange(
																index,
																"value",
																e.target.value,
															)
														}
														placeholder="Enter value"
														className="rounded border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
													/>

													{/* إزالة الشرط */}
													{index > 0 && (
														<button
															type="button"
															onClick={() => removeCondition(index)}
															className="text-[#00203F] hover:underline"
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
														className="rounded border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
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
												className="mt-4 rounded bg-[#00203F] px-4 py-2 text-[#ADF0D1] hover:bg-opacity-90"
											>
												Add Another Condition
											</button>
										</div>
									)}

								{/* عرض الأعمدة كـ Checkboxes أو RadioButtons */}
								{!endMessage &&
									(selectedTable || x) &&
									tableColumns.length > 0 &&
									!isDelete &&
									!isDropMode &&
									!isAddColumn && (
										<div className="mt-4">
											<p className="mb-2 font-medium text-[#00203F]">
												Select columns from{" "}
												{selectedTable ? selectedTable.split(":")[0] : "tables"}
												:
											</p>
											<div className="space-y-2">
												{syntax.includes("[")
													? // إذا كان الجواب يحتوي على "[" استخدم Checkboxes
														tableColumns.map((column, index) => (
															<label
																key={index}
																className="flex items-center space-x-2 text-[#00203F]"
															>
																<input
																	type="checkbox"
																	value={column}
																	onChange={() => toggleColumnSelection(column)}
																	className="rounded border-[#00203F] text-[#00203F] focus:ring-[#00203F]"
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
																		className="ml-2 w-32 rounded-md border-[#00203F] p-1 text-[#00203F] focus:ring-[#00203F]"
																	/>
																)}
															</label>
														))
													: // إذا لم يحتوي الجواب على "[" استخدم RadioButtons
														tableColumns.map((column, index) => (
															<label
																key={index}
																className="flex items-center space-x-2 text-[#00203F]"
															>
																<input
																	type="radio"
																	name="column"
																	value={column}
																	onChange={() => handleColumnSelection(column)}
																	className="rounded border-[#00203F] text-[#00203F] focus:ring-[#00203F]"
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
																		className="ml-2 w-32 rounded-md border-[#00203F] p-1 text-[#00203F] focus:ring-[#00203F]"
																	/>
																)}
															</label>
														))}
											</div>
											<button
												className="mt-4 w-full rounded-md bg-[#00203F] py-2 text-[#ADF0D1] transition duration-200 hover:bg-opacity-90"
												onClick={generateSQL}
											>
												Generate SQL Query
											</button>
										</div>
									)}

								{/* حذف جدول  */}
								{isDropMode && (
									<div className="mt-4">
										<p className="mb-2 font-medium text-[#00203F]">
											Please choose a table for drop:
										</p>
										<ul className="space-y-4">
											{extraOptions.map((extraOption, index) => (
												<li key={index}>
													<button
														className="w-full rounded-md bg-[#00203F] py-2 text-[#ADF0D1] transition duration-200 hover:bg-opacity-90"
														onClick={() => generateDropTableSQL(extraOption)}
													>
														{extraOption}
													</button>
												</li>
											))}
										</ul>
									</div>
								)}

								{/* زر إنشاء استعلام DELETE */}
								{!endMessage && selectedTable && isDelete && !isAddColumn && (
									<button
										className="mt-4 w-full rounded-md bg-[#00203F] py-2 text-[#ADF0D1] transition duration-200 hover:bg-opacity-90"
										onClick={generateDeleteSQL}
									>
										Generate SQL Query
									</button>
								)}

								{/* واجهة إنشاء جدول جديد */}
								{!endMessage && createTable && !isAddColumn && (
									<div className="rounded-lg bg-[#ADF0D1] p-6 shadow-md">
										<div className="mb-4">
											<label
												htmlFor="tableName"
												className="mb-2 block text-sm font-medium text-[#00203F]"
											>
												Table Name:
											</label>
											<input
												type="text"
												id="tableName"
												name="tableName"
												placeholder="Enter the table name"
												onChange={(e) => handleTableNameChange(e.target.value)}
												className="w-full rounded-md border border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
											/>
										</div>

										{columns.map((col, index) => (
											<div key={index} className="mb-4">
												<div className="mb-2">
													<label
														htmlFor={`columnName${index}`}
														className="block text-sm font-medium text-[#00203F]"
													>
														Column Name:
													</label>
													<input
														type="text"
														id={`columnName${index}`}
														value={col.name}
														onChange={(e) =>
															handleCreateColumnChange(
																index,
																"name",
																e.target.value,
															)
														}
														placeholder="Enter the column name"
														className="w-full rounded-md border border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
													/>
												</div>
												<div>
													<label
														htmlFor={`columnType${index}`}
														className="block text-sm font-medium text-[#00203F]"
													>
														Column Type:
													</label>
													<select
														id={`columnType${index}`}
														value={col.type}
														onChange={(e) =>
															handleCreateColumnChange(
																index,
																"type",
																e.target.value,
															)
														}
														className="w-full rounded-md border border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
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
												className="rounded-md bg-[#00203F] px-4 py-2 text-[#ADF0D1] hover:bg-opacity-90"
											>
												New Column
											</button>
											<button
												className="rounded-md bg-[#00203F] px-4 py-2 text-[#ADF0D1] hover:bg-opacity-90"
												onClick={generateCreateTableSQL}
											>
												Generate SQL Query
											</button>
										</div>
									</div>
								)}
								{/* واجهة اضافة عامود */}
								{!endMessage && isAddColumn && !isDelete && (
									<div>
										<div>
											{/* عرض خيارات الجداول */}
											{extraOptions.length > 0 && !selectedTable && (
												<div className="mt-4">
													<p className="mb-2 font-medium text-[#00203F]">
														Please choose a table:
													</p>
													<ul className="space-y-4">
														{extraOptions.map((extraOption, index) => (
															<li key={index}>
																<button
																	className="w-full rounded-md bg-[#00203F] py-2 text-[#ADF0D1] transition duration-200 hover:bg-opacity-90"
																	onClick={() =>
																		handleTableSelection(extraOption)
																	}
																>
																	{extraOption}
																</button>
															</li>
														))}
													</ul>
												</div>
											)}
											{columns.map((col, index) => (
												<div key={index} className="mb-4">
													<div className="mb-2">
														<label
															htmlFor={`columnName${index}`}
															className="block text-sm font-medium text-[#00203F]"
														>
															Column Name:
														</label>
														<input
															type="text"
															id={`columnName${index}`}
															value={col.name}
															onChange={(e) =>
																handleCreateColumnChange(
																	index,
																	"name",
																	e.target.value,
																)
															}
															placeholder="Enter the column name"
															className="w-full rounded-md border border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
														/>
													</div>
													<div>
														<label
															htmlFor={`columnType${index}`}
															className="block text-sm font-medium text-[#00203F]"
														>
															Column Type:
														</label>
														<select
															id={`columnType${index}`}
															value={col.type}
															onChange={(e) =>
																handleCreateColumnChange(
																	index,
																	"type",
																	e.target.value,
																)
															}
															className="w-full rounded-md border border-[#00203F] p-2 text-[#00203F] focus:ring-[#00203F]"
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
											<button
												className="rounded-md bg-[#00203F] px-4 py-2 text-[#ADF0D1] hover:bg-opacity-90"
												onClick={generateAddColumnSQL}
											>
												Generate SQL Query
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</>
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
