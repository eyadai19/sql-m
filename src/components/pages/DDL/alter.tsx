"use client";

import Exercise from "@/components/Exercise/Exercise";
import Explanation from "@/components/Explanation/Explanation";
import { Button } from "@/components/ui/button";
import { UserExcerciseAnswerAction } from "@/lib/ServerAction/userExcerciseAnswerAction";
import PAGE_DATA from "@/utils/pagesData";
import { pageName } from "@/utils/path";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Alter({
	getAuthorizedPage,
}: {
	getAuthorizedPage: (levelName: string) => Promise<boolean | undefined>;
}) {
	const { explanationParams, exerciseParams } = PAGE_DATA.alterTable;
	const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
	const [showMessage, setShowMessage] = useState(false);

	useEffect(() => {
		const checkAccess = async () => {
			const access = await getAuthorizedPage(pageName.alter);
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
					<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ADF0D1]"></div>
				</div>
			);}

	return (
		<div>
			<Explanation {...explanationParams} />
			<Exercise
				{...exerciseParams}
				UserExcerciseAnswerAction={UserExcerciseAnswerAction.bind(
					null,
					pageName.alter,
				)}
			/>
		</div>
	);
}
