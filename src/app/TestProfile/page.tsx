import ProfilePage from "@/components/profile";
import { ProfileNavbar } from "@/components/ProfileNavbar";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileData } from "@/lib/types/userSchema";

export default function Profile() {
	return (
		<>
			<div>
				<ProfileNavbar />
			</div>
			<div>
				<ProfilePage ProfileAction={ProfileAction} />
			</div>
		</>
	);
}

async function ProfileAction(): Promise<
	ProfileData | { field: string; message: string } | undefined
> {
	"use server";
	try {
		const user = await getUser();
		if (!user) {
			return;
		}

		const info = await db.query.TB_user.findFirst({
			where: (info, { eq }) => eq(info.id, user.id),
			with: {
				quizzes: {
					with: {
						stage: true,
					},
				},
				stage: true,
			},
		});

		if (info) {
			return {
				id: info.id,
				username: info.username,
				firstName: info.firstName || "",
				lastName: info.lastName || "",
				photo: info.photo || null,
				createdTime: info.createdTime,
				lastUpdateTime: info.lastUpdateTime,
				stage: {
					id: info.stage.id,
					stage: info.stage.stage,
				},
				quizzes: info.quizzes.map((quiz) => ({
					id: quiz.id,
					mark: quiz.mark ?? 0,
				})),
			};
		} else {
			return { field: "root", message: "No user data found" };
		}
	} catch (error) {
		return { field: "root", message: "Error fetching user data" };
	}
}
