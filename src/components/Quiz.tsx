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
import { QuizInput } from "@/lib/types/exerciseTypes";
import {
	userExcerciseAnswerError,
	userQuizAnswerSchema,
} from "@/lib/types/userSchema";
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DraggableItem } from "./Exercise/DragDropExercise/DraggableItem";

export default function SqlQuiz({
	quizAction,
	quizQuestionAction,
	getAuthorizedQuiz,
}: {
	quizAction: (
		data: QuizInput,
	) => Promise<
		| { score: number; correctAnswers: string[] }
		| userExcerciseAnswerError
		| undefined
	>;
	quizQuestionAction: () => Promise<
		| { field: string; message: string }
		| undefined
		| (
				| { question: string; type: "NormalExercise" | "TrueFalseExercise" }
				| {
						question: string;
						type: "DragDropExercise" | "MultipleChoiceExercise";
						options: string[];
				  }
		  )[]
	>;
	getAuthorizedQuiz: () => Promise<boolean | undefined>;
}) {
	const router = useRouter();
	const [questions, setQuestions] = useState<
		| (
				| { question: string; type: "NormalExercise" | "TrueFalseExercise" }
				| {
						question: string;
						type: "DragDropExercise" | "MultipleChoiceExercise";
						options: string[];
				  }
		  )[]
		| undefined
	>();
	const [isLoading, setIsLoading] = useState(true);
	const [results, setResults] = useState<(boolean | null)[]>([]);
	const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [score, setScore] = useState<number | null>(null);
	const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [isOverlayVisible, setIsOverlayVisible] = useState(false);
	const [activeId, setActiveId] = useState<string | null>(null); // لتتبع العنصر النشط أثناء السحب

	const form = useForm<z.infer<typeof userQuizAnswerSchema>>({
		defaultValues: {
			question: questions?.map((q) => q.question) || [],
			answer:
				questions?.map((q) => (q.type === "DragDropExercise" ? [] : "")) || [],
		},
		resolver: zodResolver(userQuizAnswerSchema),
	});

	useEffect(() => {
		if (questions) {
			// إذا كانت الأسئلة موجودة، أظهر التحميل لمدة 5 ثوانٍ
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 10000);

			// تنظيف المؤقت إذا تم إلغاء التحميل قبل انتهاء الوقت
			return () => clearTimeout(timer);
		}
	}, [questions]);

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
				form.reset({
					question: fetchedQuestions.map((q) => q.question),
					answer: fetchedQuestions.map((q) =>
						q.type === "DragDropExercise" ? [] : "",
					),
				});
			}
		};
		fetchQuestions();
	}, [quizQuestionAction, form]);

	useEffect(() => {
		if (form.formState.errors) {
			console.log("Form errors:", form.formState.errors);
		}
	}, [form.formState.errors]);

	const handleSubmit = async (data: z.infer<typeof userQuizAnswerSchema>) => {
		console.log("data" + data);

		if (!questions) {
			console.error("No questions available.");
			return;
		}

		setIsSubmitting(true);
		setIsOverlayVisible(true);

		const formattedData: QuizInput = questions
			.map((q, index) => {
				if (q.type === "NormalExercise" || q.type === "TrueFalseExercise") {
					return {
						question: q.question,
						answer: data.answer[index] as string,
						type: q.type,
					};
				} else if (q.type === "MultipleChoiceExercise") {
					return {
						question: q.question,
						type: "MultipleChoiceExercise",
						options: q.options,
						answer: data.answer[index] as string,
					};
				} else if (q.type === "DragDropExercise") {
					return {
						question: q.question,
						type: "DragDropExercise",
						options: q.options,
						order: data.answer[index] as string[],
					};
				}
				return undefined;
			})
			.filter((item): item is QuizInput[number] => item !== undefined);

		const result = await quizAction(formattedData);
		setIsSubmitting(false);

		if (result && "score" in result && "correctAnswers" in result) {
			setScore(result.score);
			setCorrectAnswers(result.correctAnswers);
			setIsSubmitted(true);
			setShowModal(true);
			setIsDisabled(true);

			const newResults = questions.map((q, index) => {
				const answer = data.answer[index];
				const correctAnswer = result.correctAnswers[index];

				return typeof answer === "string" && typeof correctAnswer === "string"
					? answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
					: false;
			});
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
				<div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	if (!questions) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	return (
		<div
			className="relative flex min-h-screen items-center justify-center px-4 sm:px-8"
			style={{
				background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
			}}
		>
			{isOverlayVisible && (
				<div className="absolute inset-0 z-50 bg-gray-600 bg-opacity-50"></div>
			)}
			<div className="container relative z-10 mx-auto max-w-3xl rounded-lg bg-white px-4 py-8 sm:px-6 sm:py-8">
				<div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
					<h1 className="text-2xl font-bold text-[#00203F] sm:text-3xl">
						Quiz
					</h1>
					{score !== null && (
						<span className="mt-2 text-xl font-semibold text-[#00203F] sm:mt-0">
							Score: {score?.toFixed(2)} / 100
						</span>
					)}
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="space-y-4 sm:space-y-6">
							{questions &&
								questions.map((q, index) => (
									<div
										key={index}
										className="rounded-lg border bg-gray-50 p-4 shadow-sm"
									>
										<FormField
											name={`answer.${index}`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base font-medium text-gray-700 sm:text-lg">
														{q.type !== "TrueFalseExercise" ? q.question : null}
													</FormLabel>
													<FormControl>
														{q.type === "NormalExercise" ? (
															<Input
																{...field}
																placeholder="Type your answer here..."
																className="text-base sm:text-lg"
																disabled={isDisabled}
															/>
														) : q.type === "TrueFalseExercise" ? (
															<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
																<div className="flex gap-2">
																	<Button
																		type="button"
																		onClick={() => field.onChange("true")}
																		variant={
																			field.value === "true"
																				? "default"
																				: "outline"
																		}
																		disabled={isDisabled}
																		className="flex w-8 items-center justify-center text-center"
																		size="sm"
																	>
																		<Check className="h-4 w-4" />
																	</Button>
																	<Button
																		type="button"
																		onClick={() => field.onChange("false")}
																		variant={
																			field.value === "false"
																				? "default"
																				: "outline"
																		}
																		disabled={isDisabled}
																		className="flex w-8 items-center justify-center"
																		size="sm"
																	>
																		<X className="h-4 w-4" />
																	</Button>
																</div>
																<p className="text-base">{q.question}</p>
															</div>
														) : q.type === "MultipleChoiceExercise" ? (
															<div className="grid gap-2">
																{q.options.map((option, optIndex) => (
																	<Button
																		key={optIndex}
																		type="button"
																		onClick={() => field.onChange(option)}
																		variant={
																			field.value === option
																				? "default"
																				: "outline"
																		}
																		className={`flex h-auto w-full flex-col items-center justify-center p-2 ${
																			field.value !== option
																				? "bg-white/30"
																				: ""
																		}`}
																	>
																		<span className="text-center">
																			{option}
																		</span>
																	</Button>
																))}
															</div>
														) : q.type === "DragDropExercise" ? (
															<DndContext
																sensors={useSensors(
																	useSensor(PointerSensor),
																	useSensor(KeyboardSensor),
																)}
																collisionDetection={closestCenter}
																onDragStart={({ active }) => {
																	setActiveId(active.id as string);
																}}
																onDragEnd={(event) => {
																	const { active, over } = event;
																	if (active.id !== over?.id) {
																		const oldIndex = q.options.findIndex(
																			(item) => item === active.id,
																		);
																		const newIndex = q.options.findIndex(
																			(item) => item === over?.id,
																		);
																		const newOptions = arrayMove(
																			q.options,
																			oldIndex,
																			newIndex,
																		);
																		field.onChange(newOptions);
																	}
																	setActiveId(null);
																}}
															>
																<SortableContext
																	items={q.options}
																	strategy={verticalListSortingStrategy}
																>
																	<div className="space-y-2">
																		{q.options.map((option) => (
																			<DraggableItem
																				key={option}
																				id={option}
																				content={option}
																			/>
																		))}
																	</div>
																</SortableContext>
																<DragOverlay>
																	{activeId ? (
																		<DraggableItem
																			id={activeId}
																			content={
																				q.options.find(
																					(item) => item === activeId,
																				)!
																			}
																		/>
																	) : null}
																</DragOverlay>
															</DndContext>
														) : null}
													</FormControl>
													<FormMessage />
													{results[index] != null && (
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

						<div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
							<Button
								type="submit"
								className="w-full bg-[#00203F] text-white"
								disabled={isSubmitting || isDisabled}
							>
								{isSubmitting ? (
									<div className="h-6 w-6 animate-spin rounded-full border-b-4 border-t-4 border-white"></div>
								) : (
									"Submit Answers"
								)}
							</Button>
							{isSubmitted && (
								<Button
									type="button"
									className="w-full bg-gray-500 text-white"
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
					<div className="w-full max-w-lg rounded-lg bg-white p-6 text-center shadow-lg sm:p-8">
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
