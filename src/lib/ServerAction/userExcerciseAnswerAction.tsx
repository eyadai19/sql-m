import { nanoid } from "nanoid";
import { z } from "zod";
import { getUser } from "../auth";
import { db } from "../db";
import { TB_user_excercise_summary } from "../schema";
import {
	userExcerciseAnswerError,
	userExcerciseAnswerSchema,
} from "../types/userSchema";

export async function UserExcerciseAnswerAction(
	input: z.infer<typeof userExcerciseAnswerSchema>,
): Promise<userExcerciseAnswerError | undefined> {
	"use server";

	const query = await userExcerciseAnswerSchema.parseAsync({
		...input,
		time: input.time,
	});

	const level = await db.query.TB_level.findFirst({
		where: (level, { eq }) => eq(level.level, "dataType"),
	});
	const levelID = level?.id;
	if (!levelID) {
		return { field: "root", message: "Level ID is missing" };
	}

	const user = await getUser();
	if (!user) {
		return;
	}

	const data = {
		id: nanoid(),
		userId: user.id,
		levelId: levelID,
		...query,
	};

	try {
		await db.insert(TB_user_excercise_summary).values(data);
	} catch {
		return { field: "root", message: "cannot calc input" };
	}

	// redirect("/src/app/page.tsx");
}
