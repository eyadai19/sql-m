"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowForward } from "react-icons/io5"; // استيراد أيقونة السهم

export default function QuizDetalisPage({
	QuizDetailsAction,
}: {
	QuizDetailsAction: () => Promise<
		| { question: string; answer: string; score: number }[]
		| { field: string; message: string }
		| undefined
	>;
}) {
	const [quizData, setQuizData] = useState<
		{ question: string; answer: string; accuracy: number }[]
	>([]);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const data = await QuizDetailsAction();
				
				if (Array.isArray(data)) {
					setQuizData(
						data.map((item) => ({
							question: item.question,
							answer: item.answer,
							accuracy: item.score,
						})),
					);
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

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center text-red-500">
				{error}
			</div>
		);
	}

	return (
		<div
			className="min-h-screen p-6 text-[#00203F]"
			style={{
				background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
			}}
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
				{quizData.map((item, index) => (
					<div
						key={index}
						className="mb-4 flex items-center justify-between border-b border-gray-200 p-4 last:border-b-0"
					>
						<div>
							<h2 className="text-xl font-semibold">
								Q{index + 1}: {item.question}
							</h2>
							<p className="text-gray-600">Answer: {item.answer}</p>
						</div>
						<div
							className="rounded-full px-4 py-2 text-lg font-bold"
							style={{
								backgroundColor: interpolateColor(item.accuracy, 0, 100),
								color: "#00203F",
							}}
						>
							{item.accuracy.toFixed(2)}%
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
