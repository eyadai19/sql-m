import Chatbot from "@/components/Chatbot";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import ProfilePage from "@/components/profile";
import { getUser, lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user } from "@/lib/schema";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExp";
import {
	ChatbotAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
	ChatbotWithNewContextAction,
} from "@/lib/ServerAction/chatBotNLP";
import {
	editPostAction,
	postCommentAction,
	postCommentLikeAction,
	postLikeAction,
	userPostAction,
} from "@/lib/ServerAction/postsAction";
import { ProfileData } from "@/lib/types/authSchemas";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deletePostAction } from "../../lib/ServerAction/postsAction";

import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Profile",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function Profile() {
	return (
		<div>
			<ProfileNavbar logoutAction={logoutAction} />
			<ProfilePage
				ProfileAction={ProfileAction}
				UpdateProfileAction={UpdateProfileAction}
				userPostAction={userPostAction}
				editPostAction={editPostAction}
				deletePostAction={deletePostAction}
				postCommentAction={postCommentAction}
				postCommentLikeAction={postCommentLikeAction}
				postLikeAction={postLikeAction}
			/>
			<Chatbot
				ChatbotAction={ChatbotAction}
				ChatbotExpAction={ChatbotExpAction}
				ChatbotTrArToEn={ChatbotTrArToEn}
				ChatbotTrEnToAr={ChatbotTrEnToAr}
				ChatbotWithNewContextAction={ChatbotWithNewContextAction}
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
			return { field: "root", message: "User not authenticated." };
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
					index: info.stage.index,
				},
				quizzes: info.quizzes.map((quiz) => ({
					id: quiz.id,
					stage: quiz.stage.stage,
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
	photo: string | null,
): Promise<string | { field: string; message: string } | undefined> {
	"use server";

	try {
		const firstName = form.get("firstName")?.toString();
		const lastName = form.get("lastName")?.toString();

		if (!firstName || !lastName) {
			return {
				field: "form",
				message: "First name and last name are required",
			};
		}

		const user = await getUser();
		if (!user) {
			return { field: "root", message: "User not authenticated." };
		}

		const updateData: { firstName: string; lastName: string; photo?: string } =
			{
				firstName,
				lastName,
			};

		if (photo) {
			updateData.photo = photo;
		}

		// تنفيذ التحديث
		const updatedUser = await db
			.update(TB_user)
			.set(updateData)
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
