import RegisterForm from "@/components/RegisterForm";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user } from "@/lib/schema";
import { RegisterFormError, registerFormSchema } from "@/lib/types/authSchemas";
import hash from "@/lib/utils";
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
		const { photo, ...data } = await registerFormSchema.parseAsync(input);

		let photoBuffer: Buffer | undefined;
		if (photo) {
			const arrayBuffer = await photo.arrayBuffer();
			photoBuffer = Buffer.from(arrayBuffer);
		}

		const stage = await db.query.TB_stage.findFirst({
			where: (stage, { eq }) => eq(stage.index, 0),
		});
		const stageID = stage?.id;
		if (!stageID) {
			return { field: "root", message: "No initial stage found" };
		}

		const newUser = {
			id: nanoid(),
			...data,
			password: hash(data.password),
			stageId: stageID,
			photo: photoBuffer,
		};

		try {
			await db.insert(TB_user).values(newUser);
		} catch {
			return { field: "username", message: "Username is already taken" };
		}

		const session = await lucia.createSession(newUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);

		return redirect("/basic/dataType");
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}
