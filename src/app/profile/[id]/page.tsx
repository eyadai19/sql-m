// for app-sidebar:
// const userStage = await db.query.TB_user.findFirst({
// 	where: (info, { eq }) => eq(info.id, params.id),
// 	with: {
// 		stage: true,
// 	},
// });
// const userStageIndex = userStage?.stage.index;

import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

interface ProfileInfo {
	params: {
		id: string;
	};
}

export default async function profile({ params }: ProfileInfo) {
	const user = await getUser();
	if (!user) {
		return;
	}

	const info = await db.query.TB_user.findFirst({
		where: (info, { eq }) => eq(info.id, params.id),
		with: {
			quizzes: {
				with: {
					stage: true,
				},
			},
			stage: true,
		},
	});

	return (
		<div>
			<div>
				{/* user info */}
				<div>user name: {info?.username}</div>
				<div>stage: {info?.stage.stage}</div>
				<div>
					{/* quiz info */}
					quiz mark:
					<div>
						{info?.quizzes.map((quiz) => (
							<div key={quiz.id}>
								<div>stage: {quiz.stage.stage}</div>
								<div>mark: {quiz.mark}</div>
								{/* Button to view quiz details */}
								<Link href={`../../QuizDetails/${quiz.id}`}>
									<button className="btn-primary">View Quiz Details</button>
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
