"use client";

import "tippy.js/dist/tippy.css";

import {
	userChatBotInputSchema,
	userExcerciseAnswerError,
} from "@/lib/types/userSchema";

import Tippy from "@tippyjs/react";
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
import ChatbotExpTest from "./ChatbotExpTest";

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
											className="resize-none overflow-hidden rounded-lg bg-[#D3D3D3] p-3 pr-10 text-sm text-[#00203F] shadow-sm transition-shadow focus:shadow-md"
											value={newContext}
											onChange={(e) => {
												setNewContext(e.target.value);
												autoResize(e.target);
											}}
											rows={3}
										/>
										<div className="absolute right-2 top-2 cursor-pointer">
											<Tippy content="أدخل السياق الجديد هنا (مثال: معلومات عن المشروع)">
												<FaInfoCircle className="text-[#00203F] opacity-70 hover:opacity-100" />
											</Tippy>
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
									<div className="absolute right-2 top-2 cursor-pointer">
										<Tippy content="أدخل سؤالك هنا (مثال: ما هي الخطوات التالية؟)">
											<FaInfoCircle className="text-[#00203F] opacity-70 hover:opacity-100" />
										</Tippy>
									</div>
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
									</div>
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
