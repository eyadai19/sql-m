"use server";
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
	pageName: string,
	input: z.infer<typeof userExcerciseAnswerSchema>,
): Promise<userExcerciseAnswerError | undefined> {
	if (!pageName) {
		return { field: "root", message: "Level is missing" };
	}
	const level = await db.query.TB_level.findFirst({
		where: (level, { eq }) => eq(level.level, pageName),
	});
	if (!level) {
		return { field: "root", message: "Level is missing" };
	}
	const levelId = level.id;

	const query = await userExcerciseAnswerSchema.parseAsync({
		...input,
	});

	const user = await getUser();
	if (!user) {
		return { field: "root", message: "account error" };
	}

	const data = {
		id: nanoid(),
		userId: user.id,
		levelId: levelId,
		...query,
	};

	try {
		await db.insert(TB_user_excercise_summary).values(data);
	} catch {
		return { field: "root", message: "input error" };
	}
}
