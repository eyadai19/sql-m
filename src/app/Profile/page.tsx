import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import ProfilePage from "@/components/profile";
import { getUser, lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user } from "@/lib/schema";
import { ProfileData } from "@/lib/types/authSchemas";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Profile() {
	return (
		<div>
			<ProfileNavbar logoutAction={logoutAction} />
			<ProfilePage
				ProfileAction={ProfileAction}
				UpdateProfileAction={UpdateProfileAction}
			/>
		</div>
	);
}

export async function logoutAction() {
	"use server";

	const sessionCookie = cookies().get(lucia.sessionCookieName);
	if (sessionCookie) {
		await lucia.invalidateSession(sessionCookie.value);
		cookies().set({
			name: lucia.sessionCookieName,
			value: "",
			expires: new Date(0),
		});
	}
	redirect("/login");
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

		if (info?.photo) {
			// Convert photo from Uint8Array to Base64
			const base64Photo = `data:image/jpeg;base64,${Buffer.from(info.photo).toString("base64")}`;
			info.photo = base64Photo;
		}

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

async function UpdateProfileAction(
	form: FormData,
): Promise<string | { field: string; message: string } | undefined> {
	"use server";

	try {
		const firstName = form.get("firstName")?.toString();
		const lastName = form.get("lastName")?.toString();
		const photo = form.get("photo") as File | null;

		if (!firstName || !lastName) {
			return {
				field: "form",
				message: "First name and last name are required",
			};
		}

		const user = await getUser();
		if (!user) {
			return { field: "root", message: "User not found" };
		}

		let photoBase64: string | undefined = undefined;

		if (photo) {
			const arrayBuffer = await photo.arrayBuffer();
			const photoBuffer = Buffer.from(arrayBuffer);

			photoBase64 = photoBuffer.toString("base64");
		}

		const updatedUser = await db
			.update(TB_user)
			.set({
				firstName,
				lastName,
				photo: photoBase64,
			})
			.where(eq(TB_user.id, user.id));

		if (updatedUser) {
			return "Profile updated successfully";
		} else {
			return { field: "root", message: "Failed to update profile" };
		}
	} catch (error) {
		return { field: "root", message: "Error updating profile" };
	}
}
