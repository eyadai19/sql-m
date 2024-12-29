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
			{ score: number; correctAnswers: string[] }
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
	const [isDisabled, setIsDisabled] = useState(false);
	const [isOverlayVisible, setIsOverlayVisible] = useState(false);

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

		setIsSubmitting(true);
		setIsOverlayVisible(true);

		const updatedData = {
			...data,
			question: questions.map((q) => q.question),
		};

		const result = await quizAction(updatedData);
		setIsSubmitting(false);

		if (result && "score" in result && "correctAnswers" in result) {
			setScore(result.score);
			setCorrectAnswers(result.correctAnswers);
			setIsSubmitted(true);
			setShowModal(true);
			setIsDisabled(true);

			const newResults = questions.map(
				(q, index) =>
					data.answer[index].trim().toLowerCase() ===
					result.correctAnswers[index].trim().toLowerCase(),
			);
			setResults(newResults);
		} else if (result && "message" in result) {
			console.error(result.message);
		}
		setIsOverlayVisible(false);
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
			className="flex min-h-screen items-center justify-center px-8 relative"
			style={{
				background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
			}}
		>
			{isOverlayVisible && (
				<div className="absolute inset-0 z-50 bg-gray-600 bg-opacity-50"></div>
			)}
			<div className="container mx-auto max-w-3xl rounded-lg bg-white px-4 py-8 relative z-10">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-[#00203F]">Quiz</h1>
					{score !== null && (
						<span className="text-xl font-semibold text-[#00203F]">
							Score: {score?.toFixed(2)} / 100
						</span>
					)}
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="space-y-6">
							{questions.map((question, index) => (
								<div
									key={index}
									className="p-4 border rounded-lg shadow-sm bg-gray-50"
								>
									<FormField
										name={`answer.${index}`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-lg font-medium text-gray-700">
													{question.question}
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="Type your answer here..."
														className="text-lg"
														disabled={isDisabled}
													/>
												</FormControl>
												<FormMessage />
												{results[index] !== null && (
													<p
														className={`mt-2 ${
															results[index]
																? "text-green-600"
																: "text-red-600"
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
								</div>
							))}
						</div>

						<div className="flex space-x-4 mt-4">
							<Button
								type="submit"
								className="bg-[#00203F] text-white w-full"
								disabled={isSubmitting || isDisabled}
							>
								{isSubmitting ? (
									<div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-white"></div>
								) : (
									"Submit Answers"
								)}
							</Button>
							{isSubmitted && (
								<Button
									type="button"
									className="bg-gray-500 text-white w-full"
									onClick={handleGoBack}
								>
									Back
								</Button>
							)}
						</div>
					</form>
				</Form>
			</div>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
					<div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg text-center">
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
