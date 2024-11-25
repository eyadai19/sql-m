"use client";

import Exercise from "@/components/Exercise/Exercise";
import Explanation from "@/components/Explanation/Explanation";
import PAGE_DATA from "@/utils/pagesData";
export default function Schema() {
	const { explanationParams, exerciseParams } = PAGE_DATA.schema;

	return (
		<div>
			<Explanation {...explanationParams} />

			<Exercise {...exerciseParams} />
		</div>
	);
}
