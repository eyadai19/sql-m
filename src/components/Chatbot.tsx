"use client";
import {
	userChatBotInputSchema,
	userExcerciseAnswerError,
} from "@/lib/types/userSchema";
import React, { useEffect, useRef, useState } from "react";
import {
	AiOutlineArrowDown,
	AiOutlineArrowLeft,
	AiOutlineArrowUp,
	AiOutlineClose,
	AiOutlineReload,
} from "react-icons/ai";
import { z } from "zod";

export default function ChatBot({
	ChatbotAction,
	ChatbotExpAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
}: {
	ChatbotAction(
		input: z.infer<typeof userChatBotInputSchema>,
	): Promise<{ answer: string } | userExcerciseAnswerError | undefined>;
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
	ChatbotTrArToEn(
		input: z.infer<typeof userChatBotInputSchema>,
	): Promise<{ answer: string } | userExcerciseAnswerError | undefined>;
	ChatbotTrEnToAr(
		input: z.infer<typeof userChatBotInputSchema>,
	): Promise<{ answer: string } | userExcerciseAnswerError | undefined>;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [language, setLanguage] = useState("");
	const [inChatMode, setInChatMode] = useState("");
	const [userAnswer, setUserAnswer] = useState("");
	const [questionData, setQuestionData] = useState<any>(null);
	const [isFirstQuestion, setIsFirstQuestion] = useState(true);
	const [chatHistory, setChatHistory] = useState<
		{ question: string; answer: string }[]
	>([]);
	const [finalAnswer, setFinalAnswer] = useState<string>("");
	const [compiledData, setCompiledData] = useState<any[]>([]);
	const [userQuery, setUserQuery] = useState("");
	const [queryResult, setQueryResult] = useState("");
	const [contextOption, setContextOption] = useState("use my context");
	const [newContext, setNewContext] = useState("");
	const [loading, setLoading] = useState(false);

	const handleQuerySubmit = async () => {
		setLoading(true); // إظهار الـ loader
		try {
			if (language == "AR") {
				const questionEN = await ChatbotTrArToEn({ question: userQuery });
				if (questionEN && "answer" in questionEN) {
					const result = await ChatbotAction({ question: questionEN.answer });
					if (result && "answer" in result) setQueryResult(result.answer);
					else return result?.message;
				} else return questionEN?.message;
			} else {
				const result = await ChatbotAction({ question: userQuery });
				if (result && "answer" in result) setQueryResult(result.answer);
				else return result?.message;
			}
		} finally {
			setLoading(false); // إخفاء الـ loader بعد إتمام العملية
		}
	};
	const handleResultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQueryResult(e.target.value);
	};

	const chatEndRef = useRef<HTMLDivElement>(null);

	const toggleChat = () => {
		setIsOpen(!isOpen);
	};

	const handleLanguageSelect = (
		selectedLanguage: React.SetStateAction<string>,
	) => {
		setLanguage(selectedLanguage);
	};

	const handleOptionSelect = (option: string) => {
		if (option === "Syntax") {
			setInChatMode("Syntax");
			setIsFirstQuestion(true);
		} else setInChatMode("Query");
	};

	const goBack = () => {
		if (inChatMode) {
			setInChatMode("");
			setUserAnswer("");
			setFinalAnswer("");
		} else {
			setLanguage("");
		}
	};

	const fetchInitialQuestion = () => {
		setQuestionData({
			question: "Welcome to the chat! What would you like to start with?",
			options: ["Introduction", "Tutorial", "FAQ"],
		});
	};

	const fetchTestQuestion = () => {
		const questions = [
			{
				question: "Please choose an action:",
				options: ["select", "update", "delete"],
				finalAnswer: "",
			},
			{
				question: "What would you like to do?",
				options: ["add", "edit", "remove"],
				finalAnswer: "gg",
			},
			{ question: "test", options: ["1", "2", "3"], finalAnswer: "" },
		];

		const randomQuestion =
			questions[Math.floor(Math.random() * questions.length)];
		setQuestionData({
			question: randomQuestion.question,
			options: randomQuestion.options,
			finalAnswer: setFinalAnswer(randomQuestion.finalAnswer),
		});
	};

	useEffect(() => {
		if (inChatMode && isFirstQuestion) {
			fetchInitialQuestion();
			setIsFirstQuestion(false);
		}
	}, [inChatMode, isFirstQuestion]);

	const handleButtonClick = (option: string) => {
		setChatHistory((prevHistory) => [
			...prevHistory,
			{ question: questionData.question, answer: option },
		]);

		setUserAnswer(option);
		setQuestionData(null);

		fetchTestQuestion();
	};

	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [chatHistory]);

	const resetChat = () => {
		setChatHistory([]);
		setUserAnswer("");
		setQuestionData(null);
		setIsFirstQuestion(true);
		setFinalAnswer("");
		setCompiledData([]); // Reset compiledData
		fetchInitialQuestion();
	};

	const handleCompile = () => {
		// Generate table data when the button is clicked
		const data = [
			{ id: 1, name: "John Doe", age: 28, action: "selected option 1" },
			{ id: 2, name: "Jane Smith", age: 34, action: "selected option 2" },
			{ id: 3, name: "Sam Brown", age: 22, action: "selected option 3" },
		];

		setCompiledData(data);
	};

	const autoResize = (element: HTMLTextAreaElement) => {
		element.style.height = "auto"; // إعادة تعيين الارتفاع
		element.style.height = `${element.scrollHeight}px`; // تعيين الارتفاع الجديد
	};
	const handleContextChange = (value: string) => {
		setContextOption(value);
		setNewContext("");
		setUserQuery("");
		setQueryResult("");
	};

	// exp متغيرات ال
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
				setTableColumns([]); // إعادة تعيين الأعمدة في حالة وجود خطأ
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

			// استدعاء API لكل جدول لجلب الأعمدة
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
		//{[column_name datatype]}
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
	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
			<div
				className={`h-[80vh] w-80 bg-[#00203F] p-4 text-white transition-all duration-300 ease-in-out ${
					isOpen
						? "translate-y-0 opacity-100"
						: "pointer-events-none translate-y-full opacity-0"
				} custom-scrollbar mb-2 flex flex-col justify-between overflow-y-auto rounded-t-lg shadow-lg`}
			>
				{/* Sticky top bar in the chat */}
				<div className="sticky top-0 z-10 flex items-center justify-between bg-[#00203F] p-2">
					{language && (
						<button
							onClick={goBack}
							className="text-[#ADF0D1] focus:outline-none"
						>
							<AiOutlineArrowLeft />
						</button>
					)}

					<h2 className="flex-1 text-center text-lg font-semibold">Mentor</h2>

					<button
						onClick={toggleChat}
						className="text-[#ADF0D1] focus:outline-none"
					>
						<AiOutlineClose />
					</button>
				</div>

				{/* Chat content */}
				<div className="mt-2 flex-1 overflow-y-auto">
					{!language && !inChatMode && (
						<div className="flex h-full flex-col items-center justify-center">
							<h3 className="text-md mb-4 text-center font-semibold">
								Choose Language
							</h3>

							<div className="flex flex-col space-y-4">
								<button
									onClick={() => handleLanguageSelect("AR")}
									className="w-40 rounded-md bg-[#ADF0D1] p-2 font-semibold text-[#00203F]"
								>
									العربية (AR)
								</button>
								<button
									onClick={() => handleLanguageSelect("EN")}
									className="w-40 rounded-md bg-[#ADF0D1] p-2 font-semibold text-[#00203F]"
								>
									English (EN)
								</button>
							</div>
						</div>
					)}

					{language && !inChatMode && (
						<div className="flex h-full flex-col items-center justify-center">
							<h3 className="text-md mb-4 mt-4 text-center font-semibold">
								{language === "AR" ? "اختر الخدمة" : "Choose Service"}
							</h3>

							<div className="flex flex-col space-y-4">
								<button
									onClick={() => handleOptionSelect("Syntax")}
									className="w-40 rounded-md bg-[#ADF0D1] p-2 font-semibold text-[#00203F]"
								>
									{language === "AR" ? "بناء الجملة" : "Syntax"}
								</button>
								<button
									onClick={() => handleOptionSelect("Query")}
									className="w-40 rounded-md bg-[#ADF0D1] p-2 font-semibold text-[#00203F]"
								>
									{language === "AR" ? "الاستعلام" : "Query"}
								</button>
							</div>
						</div>
					)}

					{/* بداية كود الاكسبيرت */}
					{inChatMode == "Syntax" && questionData && (
						<>
							<div className="mb-4">
								{chatHistory.map((entry, index) => (
									<div key={index} className="mb-2">
										<div className="flex justify-start">
											<p className="inline-block max-w-xs rounded-md bg-[#D3D3D3] p-2 text-[#00203F]">
												{entry.question}
											</p>
										</div>
										<div className="mt-1 flex justify-end">
											<p className="inline-block max-w-xs rounded-md bg-[#ADF0D1] p-2 text-[#00203F]">
												{entry.answer}
											</p>
										</div>
									</div>
								))}
							</div>

							<div className="mb-4 flex justify-center">
								<p className="mt-2 text-sm">{questionData?.question}</p>
							</div>

							{finalAnswer === "" ? (
								<div className="mb-4 flex justify-center">
									<div className="flex flex-col items-center space-y-4">
										{questionData?.options.map((option: string) => (
											<button
												key={option}
												onClick={() => handleButtonClick(option)}
												className="w-40 rounded-md bg-[#ADF0D1] p-2 text-center font-semibold text-[#00203F]"
											>
												{option}
											</button>
										))}
									</div>
								</div>
							) : (
								<div className="mt-4 flex flex-col items-center justify-center">
									<p className="mt-4 w-3/4 rounded-md bg-[#D3D3D3] p-2 text-center text-[#00203F]">
										{finalAnswer}
									</p>
									<button
										onClick={handleCompile}
										className="mt-4 w-40 rounded-md bg-[#ADF0D1] p-2 font-semibold text-[#00203F]"
									>
										{language === "AR" ? "تجميع" : "Compile"}
									</button>
								</div>
							)}
						</>
					)}
					{/* نهاية كود الاكسبيرت */}

					{/* When query */}
					{inChatMode === "Query" && (
						<div className="mt-4 flex flex-col items-center justify-center">
							<div className="mb-4 flex">
								<button
									onClick={() => handleContextChange("use my context")}
									className={`mr-2 rounded-md p-1.5 text-sm font-semibold transition-all ${contextOption === "use my context" ? "bg-[#ADF0D1] text-[#00203F]" : "bg-gray-300 text-[#00203F] hover:bg-[#A1E7D8]"}`}
								>
									{language === "AR" ? "استخدام سياقي" : "Use My Context"}
								</button>
								<button
									onClick={() => handleContextChange("use new context")}
									className={`rounded-md p-1.5 text-sm font-semibold transition-all ${contextOption === "use new context" ? "bg-[#ADF0D1] text-[#00203F]" : "bg-gray-300 text-[#00203F] hover:bg-[#A1E7D8]"}`}
								>
									{language === "AR" ? "استخدام سياق جديد" : "Use New Context"}
								</button>
							</div>
							{contextOption === "use new context" && (
								<div className="m-3 mt-4 flex w-3/4 flex-col">
									<textarea
										placeholder={
											language === "AR"
												? "أدخل السياق الجديد هنا"
												: "Enter your new context"
										}
										className="resize-none overflow-hidden rounded-md bg-[#D3D3D3] p-2 text-sm text-[#00203F]"
										value={newContext}
										onChange={(e) => {
											setNewContext(e.target.value);
											autoResize(e.target);
										}}
										rows={3}
									/>
								</div>
							)}
							{/* Input Field */}
							<div className="m-3 mt-4 flex w-3/4 flex-col">
								<textarea
									placeholder={
										language === "AR"
											? "أدخل سؤالك هنا"
											: "Enter your query here"
									}
									className="resize-none overflow-hidden rounded-md bg-[#D3D3D3] p-2 text-sm text-[#00203F]"
									value={userQuery}
									onChange={(e) => {
										setUserQuery(e.target.value);
										autoResize(e.target);
									}}
									rows={1}
								/>
							</div>
							{/* Submit Button */}
							<button
								onClick={handleQuerySubmit}
								className="mt-4 w-32 rounded-md bg-[#ADF0D1] p-2 text-sm font-semibold text-[#00203F] transition-all hover:bg-[#A1E7D8]"
							>
								{language === "AR" ? "إرسال الاستعلام" : "Submit Query"}
							</button>

							{loading && <div className="loader"></div>}
							{queryResult && (
								<div className="mt-4 flex w-3/4 flex-col">
									<textarea
										className="resize-none overflow-hidden rounded-md bg-[#D3D3D3] p-2 text-sm text-[#00203F]"
										value={queryResult}
										onChange={(e) => {
											setQueryResult(e.target.value);
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
							)}
							{queryResult && contextOption === "use my context" && (
								<div className="mt-4 flex flex-col items-center justify-center">
									<button
										onClick={handleCompile}
										className="mt-4 w-32 rounded-md bg-[#ADF0D1] p-2 text-sm font-semibold text-[#00203F] transition-all hover:bg-[#A1E7D8]"
									>
										{language === "AR" ? "تجميع" : "Compile"}{" "}
									</button>
								</div>
							)}
						</div>
					)}

					{/* {run query} */}
					{compiledData.length > 0 && (
						<div className="mt-4">
							<table className="w-full table-auto">
								<thead>
									<tr>
										{/* Extract columns from the first object in compiledData */}
										{Object.keys(compiledData[0]).map((key) => (
											<th key={key} className="border p-2 text-left">
												{key.charAt(0).toUpperCase() + key.slice(1)}{" "}
												{/* Display column name properly */}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{compiledData.map((row, index) => (
										<tr key={index}>
											{/* Display values based on columns */}
											{Object.values(row).map((value, i) => (
												<td key={i} className="border p-2">
													{String(value)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* Reset chat button inside the ChatBot */}
					{inChatMode && (
						<button
							onClick={resetChat}
							className="absolute bottom-4 left-4 rounded-full bg-[#ADF0D1] p-2 text-[#00203F]"
						>
							<AiOutlineReload />
						</button>
					)}

					<div ref={chatEndRef} />
				</div>
			</div>

			<button
				onClick={toggleChat}
				className={`rounded-full bg-[#ADF0D1] p-3 text-[#00203F] transition-all duration-300 focus:outline-none ${
					isOpen
						? "pointer-events-none opacity-0"
						: "pointer-events-auto opacity-100"
				}`}
			>
				{isOpen ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
			</button>
		</div>
	);
}
