/*
when click the profile icon on the top of home you must pass the userId and redirect to /profile 
*/
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";

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

	// for app-sidebar:
	// const userStage = await db.query.TB_user.findFirst({
	// 	where: (info, { eq }) => eq(info.id, params.id),
	// 	with: {
	// 		stage: true,
	// 	},
	// });
	// const userStageIndex = userStage?.stage.index;

	return (
		<div>
			<div>
				{/* user info*/}
				<div>user name : {info?.username}</div>
				<div>stage: {info?.stage.stage}</div>
				<div>
					{/* quiz info*/}
					quiz mark:
					<div>
						{info?.quizzes.map((x) => (
							<div>
								<div>stage : {x.stage.stage}</div>
								<div>mark : {x.mark}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
