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
	ChatbotExpAction(
		input: z.infer<typeof userChatBotInputSchema>,
	): Promise<
		| { answer: String }
		| { question: String; answers: String[] }
		| userExcerciseAnswerError
		| undefined
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

	const handleQuerySubmit = async () => {
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
										Compile
									</button>
								</div>
							)}
						</>
					)}
					{/* When query */}
					{inChatMode === "Query" && (
						<div className="mt-4 flex flex-col items-center justify-center">
							<div className="mb-4">
								<label>
									<input
										type="radio"
										name="contextOption"
										value="use my context"
										checked={contextOption === "use my context"}
										onChange={() => handleContextChange("use my context")}
									/>
									Use My Context
								</label>
								<label className="ml-4">
									<input
										type="radio"
										name="contextOption"
										value="use new context"
										checked={contextOption === "use new context"}
										onChange={() => handleContextChange("use new context")}
									/>
									Use New Context
								</label>
							</div>

							{contextOption === "use new context" && (
								<div className="m-3 mt-4 flex w-3/4 flex-col">
									<textarea
										placeholder="Enter your new context"
										className="resize-none overflow-hidden rounded-md bg-[#D3D3D3] p-2 text-[#00203F]"
										value={newContext}
										onChange={(e) => {
											setNewContext(e.target.value);
											autoResize(e.target); // لتغيير حجم الحقل تلقائيًا
										}}
										rows={3} // تعيين عدد الصفوف الافتراضي
									/>
								</div>
							)}

							{/* Input Field */}
							<div className="m-3 mt-4 flex w-3/4 flex-col">
								<textarea
									placeholder="Enter your query here"
									className="resize-none overflow-hidden rounded-md bg-[#D3D3D3] p-2 text-[#00203F]"
									value={userQuery}
									onChange={(e) => {
										setUserQuery(e.target.value);
										autoResize(e.target); // لتغيير حجم الحقل تلقائيًا
									}}
									rows={1}
								/>
							</div>
							{/* Submit Button */}
							<button
								onClick={handleQuerySubmit}
								className="mt-4 w-40 rounded-md bg-[#ADF0D1] p-2 font-semibold text-[#00203F]"
							>
								Submit Query
							</button>
							{/* Show the query result in a new text field */}
							{queryResult && (
								<div className="mt-4 flex w-3/4 flex-col">
									<textarea
										className="resize-none overflow-hidden rounded-md bg-[#D3D3D3] p-2 text-[#00203F]"
										value={queryResult}
										onChange={(e) => {
											handleResultChange;
											setQueryResult(e.target.value);
											autoResize(e.target);
										}}
										ref={(textarea) => {
											if (textarea) {
												textarea.style.height = "auto"; // إعادة التهيئة
												textarea.style.height = `${textarea.scrollHeight}px`; // تعديل الارتفاع بناءً على المحتوى
											}
										}}
										rows={1}
									/>
								</div>
							)}

							{/* button compile */}
							{queryResult && contextOption === "use my context" && (
								<div className="mt-4 flex flex-col items-center justify-center">
									<button
										onClick={handleCompile}
										className="mt-4 w-40 rounded-md bg-[#ADF0D1] p-2 font-semibold text-[#00203F]"
									>
										Compile
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
