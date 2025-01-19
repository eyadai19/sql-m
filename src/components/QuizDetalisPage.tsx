"use client";
import { Check, X } from "lucide-react";

import { QuizView } from "@/lib/types/exerciseTypes";
import { useRouter } from "next/navigation";
import {
	AwaitedReactNode,
	JSXElementConstructor,
	Key,
	ReactElement,
	ReactNode,
	ReactPortal,
	useEffect,
	useState,
} from "react";
import { IoArrowForward } from "react-icons/io5"; // استيراد أيقونة السهم

export default function QuizDetalisPage({
	QuizDetailsAction,
}: {
	QuizDetailsAction: () => Promise<
		QuizView | { field: string; message: string } | undefined
	>;
}) {
	const [quizData, setQuizData] = useState<QuizView | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const data = await QuizDetailsAction();

				if (Array.isArray(data)) {
					setQuizData(data);
				} else if (data?.message) {
					setError(data.message);
				} else {
					setError("No data found.");
				}
			} catch (err) {
				setError("Failed to fetch quiz data.");
			}
		};

		fetchQuizData();
	}, [QuizDetailsAction]);

	const interpolateColor = (value: number, min: number, max: number) => {
		const startColor = { r: 255, g: 194, b: 194 };
		const endColor = { r: 173, g: 240, b: 209 };

		const ratio = (value - min) / (max - min);

		const r = Math.round(startColor.r + ratio * (endColor.r - startColor.r));
		const g = Math.round(startColor.g + ratio * (endColor.g - startColor.g));
		const b = Math.round(startColor.b + ratio * (endColor.b - startColor.b));

		return `rgb(${r}, ${g}, ${b})`;
	};

	if (!quizData) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center text-red-500">
				{error}
			</div>
		);
	}

	const renderQuizItem = (item: any, index: number) => {
		switch (item.type) {
			case "NormalExercise":
				return (
					<div
						key={index}
						className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md transition duration-300 hover:shadow-lg"
					>
						<div className="mb-4 flex items-center space-x-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ADF0D1] text-lg font-bold text-[#00203F]">
								{index + 1}
							</div>
							<h2 className="text-xl font-semibold text-[#00203F]">
								{item.question}
							</h2>
						</div>
						<div className="rounded-lg bg-gray-100 p-4 text-sm text-gray-800 shadow-inner">
							<strong>Answer:</strong> {item.answer}
						</div>
						{item.score !== undefined && (
							<div
								className="mx-auto mt-2 w-fit rounded-full px-3 py-1 text-sm font-bold"
								style={{
									backgroundColor: interpolateColor(item.score, 0, 100),
									color: "#00203F",
								}}
							>
								{item.score.toFixed(2)}%
							</div>
						)}
					</div>
				);

			case "TrueFalseExercise":
				return (
					<div
						key={index}
						className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md transition duration-300 hover:shadow-lg"
					>
						<div className="mb-4 flex items-center space-x-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ADF0D1] text-lg font-bold text-[#00203F]">
								{index + 1}
							</div>
							<h2 className="text-xl font-semibold text-[#00203F]">
								{item.question}
							</h2>
						</div>
						<div className="text-sm text-gray-600">
							<strong>Your Answer:</strong> {item.answer ? "True" : "False"}
						</div>
						<div
							className="mx-auto mt-2 flex w-fit items-center justify-center rounded-full px-3 py-1 text-lg font-bold"
							style={{
								color: item.score === 100 ? "green" : "red",
							}}
						>
							{item.score === 100 ? <Check size={24} /> : <X size={24} />}
						</div>
					</div>
				);

			case "MultipleChoiceExercise":
				return (
					<div
						key={index}
						className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md transition duration-300 hover:shadow-lg"
					>
						<div className="mb-4 flex items-center space-x-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ADF0D1] text-lg font-bold text-[#00203F]">
								{index + 1}
							</div>
							<h2 className="text-xl font-semibold text-[#00203F]">
								{item.question}
							</h2>
						</div>
						<ul className="mb-4 grid gap-2">
							{item.options.map(
								(
									option:
										| string
										| number
										| bigint
										| boolean
										| ReactElement<any, string | JSXElementConstructor<any>>
										| Iterable<ReactNode>
										| ReactPortal
										| Promise<AwaitedReactNode>
										| null
										| undefined,
									i: Key | null | undefined,
								) => (
									<li
										key={i}
										className={`rounded-lg border p-2 ${
											option === item.answer
												? "border-gray-900 bg-gray-300 text-white"
												: "border-gray-200 bg-gray-100"
										}`}
									>
										{option}
									</li>
								),
							)}
						</ul>
						<div
							className="mx-auto mt-2 flex w-fit items-center justify-center rounded-full px-3 py-1 text-lg font-bold"
							style={{
								color: item.score === 100 ? "green" : "red",
							}}
						>
							{item.score === 100 ? <Check size={24} /> : <X size={24} />}
						</div>
					</div>
				);

			case "DragDropExercise":
				return (
					<div
						key={index}
						className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md transition duration-300 hover:shadow-lg"
					>
						<div className="mb-4 flex items-center space-x-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ADF0D1] text-lg font-bold text-[#00203F]">
								{index + 1}
							</div>
							<h2 className="text-xl font-semibold text-[#00203F]">
								{item.question}
							</h2>
						</div>
						<div className="mb-4">
							<h3 className="mb-2 font-medium text-[#00203F]">
								Arrange in Order:
							</h3>
							<ul className="space-y-2">
								{item.options.map(
									(
										option:
											| string
											| number
											| bigint
											| boolean
											| ReactElement<any, string | JSXElementConstructor<any>>
											| Iterable<ReactNode>
											| ReactPortal
											| Promise<AwaitedReactNode>
											| null
											| undefined,
										i: Key | null | undefined,
									) => (
										<li
											key={i}
											className="rounded-lg border border-gray-200 bg-gray-100 p-2 text-center"
										>
											{option}
										</li>
									),
								)}
							</ul>
						</div>
						<div
							className="mx-auto mt-2 flex w-fit items-center justify-center rounded-full px-3 py-1 text-lg font-bold"
							style={{
								color: item.score === 100 ? "green" : "red",
							}}
						>
							{item.score === 100 ? <Check size={24} /> : <X size={24} />}
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div
			className="min-h-screen p-6 text-[#00203F]"
			style={{ background: "linear-gradient(to bottom, #00203F, #ADF0D1)" }}
		>
			{/* زر الرجوع */}
			<div className="absolute right-4 top-4">
				<button
					className="rounded-full bg-white p-2 shadow-lg transition duration-300 hover:bg-gray-100"
					onClick={() => router.back()}
					title="Go back"
				>
					<IoArrowForward className="text-2xl text-[#00203F]" />
				</button>
			</div>
			{/* عنوان الصفحة */}
			<h1 className="mb-6 text-center text-3xl font-bold text-white">
				Quiz Results
			</h1>
			{/* صندوق عرض الأسئلة */}
			<div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
				{quizData.map((item, index) => renderQuizItem(item, index))}
			</div>
		</div>
	);
}
