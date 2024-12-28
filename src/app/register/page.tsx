import RegisterForm from "@/components/RegisterForm";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user } from "@/lib/schema";
import { RegisterFormError, registerFormSchema } from "@/lib/types/authSchemas";
import hash from "@/lib/utils";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export default function RegisterPage() {
	return <RegisterForm registerAction={RegisterAction} />;
}

export async function RegisterAction(
	input: z.infer<typeof registerFormSchema>,
): Promise<RegisterFormError | undefined> {
	"use server";

	try {
		// تحقق من صحة البيانات
		const { ...data } = await registerFormSchema.parseAsync(input);

		// جلب أول مرحلة
		const stage = await db.query.TB_stage.findFirst({
			where: (stage, { eq }) => eq(stage.index, 0),
		});
		const stageID = stage?.id;
		if (!stageID) {
			return { field: "root", message: "No initial stage found" };
		}

		// إنشاء المستخدم بدون صورة مبدئيًا
		const newUser = {
			id: nanoid(),
			...data,
			password: hash(data.password),
			stageId: stageID,
			photo: null, // سيتم تحديث الصورة لاحقًا
		};

		try {
			await db.insert(TB_user).values(newUser);
		} catch {
			return { field: "username", message: "Username is already taken" };
		}

		if (data.photo) {
			try {
				const uploadResponse = await fetch(
					"https://api.uploadthing.com/upload",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${process.env.UPLOADTHING_SECRET}`,
						},
						body: JSON.stringify({
							file: data.photo,
						}),
					},
				);

				if (!uploadResponse.ok) {
					console.error("Image upload failed:", uploadResponse.statusText);
					throw new Error("Failed to upload image");
				}

				const uploadResult = await uploadResponse.json();
				const photoUrl = uploadResult?.url;

				if (photoUrl) {
					await db
						.update(TB_user)
						.set({ photo: photoUrl })
						.where(eq(TB_user.id, newUser.id));
				}
			} catch (uploadError) {
				console.error(
					"An error occurred while uploading the photo:",
					uploadError,
				);
				return { field: "photo", message: "Failed to upload profile photo" };
			}
		}

		const session = await lucia.createSession(newUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);

		redirect("/Profile");
	} catch (e) {
		console.error("Unexpected error:", e);
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}
