"use client";

import Exercise from "@/components/Exercise/Exercise";
import Explanation from "@/components/Explanation/Explanation";
import { Button } from "@/components/ui/button";
import { UserExcerciseAnswerAction } from "@/lib/ServerAction/userExcerciseAnswerAction";
import PAGE_DATA from "@/utils/pagesData";
import { pageName } from "@/utils/path";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function CreateTable({
	getAuthorizedPage,
}: {
	getAuthorizedPage: (levelName: string) => Promise<boolean | undefined>;
}) {
	const { explanationParams, exerciseParams } = PAGE_DATA.createTable;
	const [hasAccess, setHasAccess] = useState<boolean | undefined>(undefined);
	const [showMessage, setShowMessage] = useState(false);

	useEffect(() => {
		const checkAccess = async () => {
			const access = await getAuthorizedPage(pageName.table);
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
		return <p></p>;
	}

	return (
		<div>
			<Explanation {...explanationParams} />
			<Exercise
				{...exerciseParams}
				UserExcerciseAnswerAction={UserExcerciseAnswerAction.bind(
					null,
					pageName.table,
				)}
			/>
		</div>
	);
}
