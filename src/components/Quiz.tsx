"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	userExcerciseAnswerError,
	userQuizAnswerSchema,
} from "@/lib/types/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SqlQuiz({
	quizAction,
	quizQuestionAction,
	getAuthorizedQuiz,
}: {
	quizAction: (
		input: z.infer<typeof userQuizAnswerSchema>,
	) => Promise<
		| { score: number; correctAnswers: string[] }
		| userExcerciseAnswerError
		| undefined
	>;
	quizQuestionAction: () => Promise<
		{ question: string }[] | { field: string; message: string } | undefined
	>;
	getAuthorizedQuiz: () => Promise<boolean | undefined>;
}) {
	const router = useRouter();
	const [questions, setQuestions] = useState<{ question: string }[]>([]);
	const [results, setResults] = useState<(boolean | null)[]>([]);
	const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [score, setScore] = useState<number | null>(null);
	const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const checkAccess = async () => {
			const access = await getAuthorizedQuiz();
			if (access === false) {
				setHasAccess(false);
			} else {
				setHasAccess(true);
			}
		};
		checkAccess();
	}, [getAuthorizedQuiz]);

	useEffect(() => {
		const fetchQuestions = async () => {
			const fetchedQuestions = await quizQuestionAction();
			if (Array.isArray(fetchedQuestions)) {
				setQuestions(fetchedQuestions);
				setResults(Array(fetchedQuestions.length).fill(null));
			}
		};
		fetchQuestions();
	}, [quizQuestionAction]);

	const form = useForm<z.infer<typeof userQuizAnswerSchema>>({
		resolver: zodResolver(userQuizAnswerSchema),
		defaultValues: {
			question: questions.map((q) => q.question),
			answer: Array(questions.length).fill(""),
		},
	});

	const handleSubmit = async (data: z.infer<typeof userQuizAnswerSchema>) => {
		if (questions.length === 0) {
			console.error("No questions available.");
			return;
		}

		setIsSubmitting(true); // Start the loading spinner

		const updatedData = {
			...data,
			question: questions.map((q) => q.question), // تحديث الأسئلة في data
		};

		// استدعاء quizAction بعد التأكد من تحديث الأسئلة
		const result = await quizAction(updatedData);
		setIsSubmitting(false); // End the loading spinner

		if (result && "score" in result && "correctAnswers" in result) {
			setScore(result.score);
			setCorrectAnswers(result.correctAnswers);
			setIsSubmitted(true);
			setShowModal(true);

			const newResults = questions.map(
				(q, index) =>
					data.answer[index].trim().toLowerCase() ===
					result.correctAnswers[index].trim().toLowerCase(),
			);
			setResults(newResults);
		} else if (result && "message" in result) {
			console.error(result.message);
		}
	};

	const handleGoBack = () => {
		router.back();
	};

	const handleReviewAnswers = () => {
		setShowModal(false);
	};

	if (hasAccess === false) {
		return (
			<div>
				<p>You have not access to this page.</p>
				<Button>
					<Link href="/home">Return to Home</Link>
				</Button>
			</div>
		);
	}

	if (hasAccess === undefined) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	return (
		<div
			className="flex min-h-screen items-center justify-center px-8"
			style={{
				background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
			}}
		>
			{/* Quiz form layout */}
			<div className="container mx-auto max-w-3xl rounded-lg bg-white px-4 py-8">
				<h1 className="mb-8 text-center text-3xl font-bold text-[#00203F]">
					Quiz
				</h1>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						{questions.map((question, index) => (
							<FormField
								key={index}
								name={`answer.${index}`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>{question.question}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Type your answer here..."
												className="text-lg" // Increase text size for input
											/>
										</FormControl>
										<FormMessage />
										{results[index] !== null && (
											<p
												className={`mt-2 ${
													results[index] ? "text-green-600" : "text-red-600"
												}`}
											>
												{results[index]
													? "Correct!"
													: `Incorrect. Correct answer: ${correctAnswers[index]}`}
											</p>
										)}
									</FormItem>
								)}
							/>
						))}

						<Button
							type="submit"
							className="mt-4 bg-[#00203F] text-white w-full"
							disabled={isSubmitting} // Disable button while submitting
						>
							{isSubmitting ? (
								<div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-white"></div> // Loading spinner
							) : (
								"Submit Answers"
							)}
						</Button>
					</form>
				</Form>
			</div>

			{/* Modal for Results */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
					<div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
						<h2 className="mb-4 text-2xl font-bold text-[#00203F]">
							Your Score: {score?.toFixed(2)} / 100
						</h2>
						<Button
							onClick={handleReviewAnswers}
							className="bg-[#00203F] text-white"
						>
							Review Answers
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
