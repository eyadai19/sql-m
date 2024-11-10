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
	return (
		
				<RegisterForm registerAction={RegisterAction} />
			
	);
}

export async function RegisterAction(
	input: z.infer<typeof registerFormSchema>,
): Promise<RegisterFormError | undefined> {
	"use server";

	try {
		const data = await registerFormSchema.parseAsync(input);

		const stage = await db.query.TB_stage.findFirst({
			where: (stage, { eq }) => eq(stage.index, 0),
		});
		const stageID = stage?.id;
		if (!stageID) {
			return;
		}
		const newUser = {
			id: nanoid(),
			...data,
			password: hash(data.password),
			stageId: stageID,
		};

		try {
			await db.insert(TB_user).values(newUser);
		} catch {
			return { field: "username", message: "Email is already used" };
		}

		const session = await lucia.createSession(newUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}

	return redirect("/basic/dataType");
}
