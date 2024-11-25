"use client";

import Exercise from "@/components/Exercise/Exercise";
import Explanation from "@/components/Explanation/Explanation";
import PAGE_DATA from "@/utils/pagesData";
export default function Operator() {
	const { explanationParams, exerciseParams } = PAGE_DATA.operator;

	return (
		<div>
			<Explanation {...explanationParams} />

			<Exercise {...exerciseParams} />
		</div>
	);
}
