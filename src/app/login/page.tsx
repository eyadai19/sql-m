import { LoginForm } from "@/components/LoginForm";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { LoginFormError, loginFormSchema } from "@/lib/types/authSchemas";
import hash from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export default function LoginPage() {
	return (
		<div className="absolute inset-0">
			<div className="mx-auto flex h-full w-full max-w-xs items-center md:max-w-sm">
				<LoginForm loginAction={LoginAction} />
			</div>
		</div>
	);
}

async function LoginAction(
	input: z.infer<typeof loginFormSchema>,
): Promise<LoginFormError | undefined> {
	"use server";

	try {
		const data = await loginFormSchema.parseAsync(input);

		const user = await db.query.TB_user.findFirst({
			where: (user, { eq }) => eq(user.username, data.username), // edit to email/username
		});

		if (!user || user.password != hash(data.password)) {
			return { field: "root", message: "Email or password is incorrect" };
		}

		const session = await lucia.createSession(user.id, {});
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

	redirect("/src/app/page.tsx");
}
