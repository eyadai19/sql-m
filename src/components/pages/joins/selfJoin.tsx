"use client";

import Exercise from "@/components/Exercise/Exercise";
import Explanation from "@/components/Explanation/Explanation";
import PAGE_DATA from "@/utils/pagesData";
export default function SelfJoin() {
	const { explanationParams, exerciseParams } = PAGE_DATA.selfJoin;

	return (
		<div>
			<Explanation {...explanationParams} />

			<Exercise {...exerciseParams} />
		</div>
	);
}
