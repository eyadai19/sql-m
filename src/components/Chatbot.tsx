"use client";

import "tippy.js/dist/tippy.css";

import {
	userChatBotInputSchema,
	userExcerciseAnswerError,
} from "@/lib/types/userSchema";

import { userDbApi } from "@/utils/apis";
import React, { useRef, useState } from "react";
import {
	AiOutlineArrowDown,
	AiOutlineArrowLeft,
	AiOutlineArrowUp,
	AiOutlineClose,
	AiOutlineReload, // استيراد أيقونة إعادة التحميل
} from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import { z } from "zod";
import ChatbotExpTest from "./ChatbotExpComponent";
interface QueryResult {
	[key: string]: string | number | boolean | null;
}
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
		question: string,
		answer: string,
	): Promise<
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
	const [userQuery, setUserQuery] = useState("");
	const [queryResult, setQueryResult] = useState("");
	const [contextOption, setContextOption] = useState("use my context");
	const [newContext, setNewContext] = useState("");
	const [loading, setLoading] = useState(false);
	const [selectResults, setSelectResults] = useState<QueryResult[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showInfoPopup, setShowInfoPopup] = useState(false);
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
		} else setInChatMode("Query");
	};

	const goBack = () => {
		if (inChatMode) {
			setInChatMode("");
		} else {
			setLanguage("");
		}
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

	const resetQueryFields = () => {
		setUserQuery("");
		setQueryResult("");
		setNewContext("");
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
					query: queryResult,
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
			setSelectResults(data.data); // عرض النتائج
		} catch (error) {
			console.error("Error executing query:", error);
			setErrorMessage("An error occurred while executing the query.");
		}
	};

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
			{isOpen && (
				<div className="mb-2 h-[80vh] w-80 rounded-t-lg bg-[#00203F] p-4 text-white shadow-lg">
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
					<div className="scrollbar-hide mt-2 flex-1 overflow-y-auto">
						{" "}
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
						{inChatMode == "Syntax" && (
							<>
								<ChatbotExpTest ChatbotExpAction={ChatbotExpAction} />
							</>
						)}
						{/* When query */}
						{inChatMode === "Query" && (
							<div className="mt-4 flex flex-col items-center justify-center">
								{/* Tabs for Context Selection */}
								<div className="mb-8 grid w-3/4 grid-cols-2 gap-2 rounded-xl bg-gray-300 p-1">
									<button
										onClick={() => handleContextChange("use my context")}
										className={`rounded-lg p-2 text-sm font-semibold transition-all ${
											contextOption === "use my context"
												? "bg-[#ADF0D1] text-[#00203F] shadow-md"
												: "bg-transparent text-[#00203F]"
										}`}
									>
										{language === "AR" ? "استخدام سياقي" : "Use My Context"}
									</button>
									<button
										onClick={() => handleContextChange("use new context")}
										className={`rounded-lg p-2 text-sm font-semibold transition-all ${
											contextOption === "use new context"
												? "bg-[#ADF0D1] text-[#00203F] shadow-md"
												: "bg-transparent text-[#00203F]"
										}`}
									>
										{language === "AR"
											? "استخدام سياق جديد"
											: "Use New Context"}
									</button>
								</div>

								{/* New Context Textarea */}
								{contextOption === "use new context" && (
									<div className="relative m-3 mt-4 flex w-3/4 flex-col">
										<textarea
											placeholder={
												language === "AR"
													? "أدخل السياق الجديد هنا"
													: "Enter your new context"
											}
											className="h-32 resize-none overflow-auto rounded-lg bg-[#D3D3D3] p-3 pr-10 text-sm text-[#00203F] shadow-sm transition-shadow focus:shadow-md"
											value={newContext}
											onChange={(e) => {
												setNewContext(e.target.value);
											}}
										/>
										<div className="absolute right-2 top-2 cursor-pointer">
											<FaInfoCircle
												className="text-[#00203F] opacity-70 hover:opacity-100"
												onClick={() => setShowInfoPopup(true)} // فتح النافذة المنبثقة عند النقر
											/>
										</div>
									</div>
								)}

								{/* نافذة منبثقة لعرض المعلومات */}
								{showInfoPopup && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
										<div className="w-11/12 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
											{/* العنوان */}
											<h2 className="mb-4 text-2xl font-bold text-[#00203F]">
												{language === "AR"
													? "كيفية استخدام هذا الحقل"
													: "How to Use This Field"}
											</h2>

											{/* خطوات الشرح */}
											<div className="space-y-4">
												{/* الخطوة 1 */}
												<div className="flex items-start space-x-4 rtl:space-x-reverse">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ADF0D1] text-lg font-bold text-[#00203F]">
														1
													</div>
													<div>
														<h3 className="text-lg font-semibold text-[#00203F]">
															{language === "AR"
																? "أدخل السياق الخاص بك"
																: "Enter Your Context"}
														</h3>
														<p className="break-words text-sm text-gray-600">
															{language === "AR"
																? "قم بإدخال نص السياق الذي تريده هنا."
																: "Provide the context text you wish to use."}
														</p>
													</div>
												</div>

												{/* الخطوة 2 */}
												<div className="flex items-start space-x-4 rtl:space-x-reverse">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ADF0D1] text-lg font-bold text-[#00203F]">
														2
													</div>
													<div>
														<h3 className="text-lg font-semibold text-[#00203F]">
															{language === "AR"
																? "حافظ على السياق مناسبًا"
																: "Keep It Relevant"}
														</h3>
														<p className="break-words text-sm text-gray-600">
															{language === "AR"
																? "تأكد من أن النص الذي تدخله مناسب للسياق المطلوب."
																: "Ensure the text you enter aligns with the desired context."}
														</p>
													</div>
												</div>

												{/* الخطوة 3 */}
												<div className="flex items-start space-x-4 rtl:space-x-reverse">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ADF0D1] text-lg font-bold text-[#00203F]">
														3
													</div>
													<div>
														<h3 className="text-lg font-semibold text-[#00203F]">
															{language === "AR"
																? "استخدم الأمثلة"
																: "Use Examples"}
														</h3>
														<p className="break-words text-sm text-gray-600">
															{language === "AR" ? (
																<pre className="whitespace-pre-wrap break-words">
																	على سبيل المثال:
																	{"\n"}
																	CREATE TABLE users (id INTEGER PRIMARY KEY,
																	name TEXT NOT NULL, email TEXT UNIQUE NOT
																	NULL);
																	{"\n"}
																	CREATE TABLE posts (id INTEGER PRIMARY KEY,
																	user_id INTEGER NOT NULL, title TEXT NOT NULL,
																	body TEXT, FOREIGN KEY(user_id) REFERENCES
																	users(id));
																</pre>
															) : (
																<pre className="whitespace-pre-wrap break-words">
																	For example:
																	{"\n"}
																	CREATE TABLE users (id INTEGER PRIMARY KEY,
																	name TEXT NOT NULL, email TEXT UNIQUE NOT
																	NULL);
																	{"\n"}
																	CREATE TABLE posts (id INTEGER PRIMARY KEY,
																	user_id INTEGER NOT NULL, title TEXT NOT NULL,
																	body TEXT, FOREIGN KEY(user_id) REFERENCES
																	users(id));
																</pre>
															)}
														</p>
													</div>
												</div>
											</div>

											{/* زر الإغلاق */}
											<div className="mt-6 flex justify-end">
												<button
													onClick={() => setShowInfoPopup(false)}
													className="rounded-lg bg-[#00203F] px-6 py-2 text-white transition-all duration-200 hover:bg-[#00152A] hover:shadow-lg"
												>
													{language === "AR" ? "إغلاق" : "Close"}
												</button>
											</div>
										</div>
									</div>
								)}
								{/* Query Input Field */}
								<div className="relative m-3 mt-4 flex w-3/4 flex-col">
									<textarea
										placeholder={
											language === "AR"
												? "أدخل سؤالك هنا"
												: "Enter your query here"
										}
										className="resize-none overflow-hidden rounded-lg bg-[#D3D3D3] p-3 pr-10 text-sm text-[#00203F] shadow-sm transition-shadow focus:shadow-md"
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
									className="mt-4 w-32 rounded-lg bg-[#ADF0D1] p-2 text-sm font-semibold text-[#00203F] shadow-sm transition-all hover:bg-[#A1E7D8] hover:shadow-md"
								>
									{language === "AR" ? "إرسال الاستعلام" : "Submit Query"}
								</button>

								{/* Loading Indicator */}
								{loading && <div className="loader"></div>}

								{/* Query Result */}
								{queryResult && (
									<div className="mt-4 flex w-3/4 flex-col">
										<textarea
											className="resize-none overflow-hidden rounded-lg bg-[#D3D3D3] p-3 text-sm text-[#00203F] shadow-sm"
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
																		{Object.keys(selectResults[0]).map(
																			(key, index) => (
																				<th
																					key={index}
																					className="border-b-2 border-gray-300 px-4 py-3 text-left text-sm font-semibold"
																				>
																					{key}
																				</th>
																			),
																		)}
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
																			{Object.values(row).map(
																				(value, colIndex) => (
																					<td
																						key={colIndex}
																						className="border-t border-gray-200 px-4 py-2 text-sm text-gray-700"
																					>
																						{value != null
																							? String(value)
																							: "-"}
																					</td>
																				),
																			)}
																		</tr>
																	))}
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
									</div>
								)}
								{/* Submit Button */}
								{queryResult && (
									<button
										onClick={validateAndSelectData}
										className="mt-4 w-32 rounded-lg bg-[#ADF0D1] p-2 text-sm font-semibold text-[#00203F] shadow-sm transition-all hover:bg-[#A1E7D8] hover:shadow-md"
									>
										{language === "AR" ? "تنفيذ الاستعلام" : "Run Query"}
									</button>
								)}
							</div>
						)}
						{/* زر الـ Reset في وضع Query */}
						{inChatMode === "Query" && (
							<button
								type="button"
								onClick={resetQueryFields}
								className="fixed bottom-4 right-4 rounded-full bg-[#ADF0D1] p-3 text-white shadow-lg transition duration-200 hover:bg-[#00203F]"
							>
								<AiOutlineReload className="text-xl" />
							</button>
						)}
						<div ref={chatEndRef} />
					</div>
				</div>
			)}
			<button
				onClick={toggleChat}
				className="rounded-full bg-[#ADF0D1] p-3 text-[#00203F] transition-transform duration-300 hover:bg-[#9CE0C1] focus:outline-none"
			>
				{isOpen ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
			</button>
		</div>
	);
}
