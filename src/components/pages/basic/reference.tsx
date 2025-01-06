"use client";

import DragDropExercise from "@/components/Exercise/DragDropExercise/DragDropExercise";
import Exercise from "@/components/Exercise/Exercise";
import MultipleChoiceExercise from "@/components/Exercise/MultipleChoiceExercise/MultipleChoiceExercise";
import TrueFalseExercise from "@/components/Exercise/TrueFalseExercise/TrueFalseExercise";
import Explanation from "@/components/Explanation/Explanation";
import { Button } from "@/components/ui/button";
import { UserExcerciseAnswerAction } from "@/lib/ServerAction/userExcerciseAnswerAction";
import PAGE_DATA from "@/utils/pagesData";
import { pageName } from "@/utils/path";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Reference({
	getAuthorizedPage,
}: {
	getAuthorizedPage: (levelName: string) => Promise<boolean | undefined>;
}) {
	const {
		explanationParams,
		exerciseParams,
		trueFalseParams,
		multipleChoiceParams,
		dragDropParams,
	} = PAGE_DATA.references;
	const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
	const [showMessage, setShowMessage] = useState(false);

	useEffect(() => {
		const checkAccess = async () => {
			const access = await getAuthorizedPage(pageName.reference);
			if (access === false) {
				setShowMessage(true);
			} else {
				setHasAccess(access);
			}
		};

		checkAccess();
	}, [getAuthorizedPage]);

	if (showMessage) {
		return (
			<div>
				<p>You have not access to this page.</p>
				<Button>
					<Link href={"/home"}>Return to Home</Link>
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

	return (
		<div>
			<Explanation {...explanationParams} />

			<DragDropExercise
				{...dragDropParams!}
				UserExcerciseAnswerAction={UserExcerciseAnswerAction.bind(
					null,
					pageName.dataType,
				)}
			/>
			<MultipleChoiceExercise
				{...multipleChoiceParams!}
				UserExcerciseAnswerAction={UserExcerciseAnswerAction.bind(
					null,
					pageName.dataType,
				)}
			/>
			<TrueFalseExercise
				{...trueFalseParams!}
				UserExcerciseAnswerAction={UserExcerciseAnswerAction.bind(
					null,
					pageName.dataType,
				)}
			/>
			<Exercise
				{...exerciseParams}
				UserExcerciseAnswerAction={UserExcerciseAnswerAction.bind(
					null,
					pageName.reference,
				)}
			/>
		</div>
	);
}
