"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	userExcerciseAnswerError,
	userExcerciseAnswerSchema,
	userExcerciseAnswerSchemaForInput,
} from "@/lib/types/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function DataType({
	userExcerciseAnswerAction,
}: {
	userExcerciseAnswerAction: (
		input: z.infer<typeof userExcerciseAnswerSchema>,
	) => Promise<userExcerciseAnswerError | undefined>;
}) {
	const form = useForm<z.infer<typeof userExcerciseAnswerSchemaForInput>>({
		resolver: zodResolver(userExcerciseAnswerSchemaForInput),
		defaultValues: {
			is_show_ans: false,
		},
	});

	const [startTime, setStartTime] = useState<Date | null>(null);
	const [trials, setTrials] = useState(1);
	const [showAnswer, setShowAnswer] = useState(false);

	useEffect(() => {
		setStartTime(new Date()); // Start timing when the component loads
	}, []);

	async function onSubmit(
		values: z.infer<typeof userExcerciseAnswerSchemaForInput>,
	) {
		// move to server??
		const endTime = new Date();
		const timeElapsed =
			endTime.getTime() - (startTime?.getTime() || endTime.getTime());

		const newValue: z.infer<typeof userExcerciseAnswerSchema> = {
			trials: trials,
			is_show_ans: showAnswer,
			time: timeElapsed,
		};

		const error = await userExcerciseAnswerAction(newValue);

		if (error) {
			// Increase trial count if there’s an error
			setTrials(trials + 1);
			return;
		}
	}

	const handleShowAnswer = () => {
		setShowAnswer(true);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
				<div className="flex flex-col gap-1">
					<span className="text-2xl font-medium">تسجيل الدخول</span>
					<span className="text-sm text-muted-foreground">
						what the type of number ?
					</span>
				</div>
				<div>what the type of number ? {/*question*/}</div>
				<FormField
					control={form.control}
					name="query"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type="text" placeholder="answer" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="space-y-2">
					<Button
						disabled={form.formState.isSubmitting}
						className="w-full"
						type="submit"
					>
						submit
					</Button>
					<Button
						variant="secondary"
						className="w-full"
						onClick={handleShowAnswer}
						type="button"
					>
						Show Answer
					</Button>
					{showAnswer && (
						<div className="text-sm text-muted-foreground">
							Answer: مرحبا وسهلا{/* Display correct answer here */}
						</div>
					)}
				</div>
			</form>
		</Form>
	);
}
