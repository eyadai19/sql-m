"use client";

import Exercise from "@/components/Exercise/Exercise";
import Explanation from "@/components/Explanation/Explanation";
import PAGE_DATA from "@/utils/pagesData";
export default function SubQuery() {
	const { explanationParams, exerciseParams } = PAGE_DATA.subQuery;

	return (
		<div>
			<Explanation {...explanationParams} />

			<Exercise {...exerciseParams} />
		</div>
	);
}
