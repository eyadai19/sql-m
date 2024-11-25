"use client";

import Exercise from "@/components/Exercise/Exercise";
import Explanation from "@/components/Explanation/Explanation";
import PAGE_DATA from "@/utils/pagesData";
export default function Where() {
	const { explanationParams, exerciseParams } = PAGE_DATA.where;

	return (
		<div>
			<Explanation {...explanationParams} />

			<Exercise {...exerciseParams} />
		</div>
	);
}
