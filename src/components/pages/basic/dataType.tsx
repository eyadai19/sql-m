"use client";

import Exercise from "@/components/Exercise/Exercise";
import Explanation from "@/components/Explanation/Explanation";
import { UserExcerciseAnswerAction } from "@/lib/ServerAction/userExcerciseAnswerAction";
import PAGE_DATA from "@/utils/pagesData";
import { pageName } from "@/utils/path";
export default function DataType() {
	const { explanationParams, exerciseParams } = PAGE_DATA.dataTypes;

	return (
		<div>
			<Explanation {...explanationParams} />

			<Exercise
				{...exerciseParams}
				UserExcerciseAnswerAction={UserExcerciseAnswerAction.bind(
					null,
					pageName.dataType,
				)}
			/>
		</div>
	);
}
