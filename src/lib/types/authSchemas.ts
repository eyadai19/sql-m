import { z } from "zod";
import { BaseZodError } from "./errorUtilities";

export const loginFormSchema = z.object({
	username: z.string().min(8),
	password: z.string().min(8).max(32),
});

export const registerFormSchema = z
	.object({
		username: z.string().min(1, "Username is required"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Confirm password must be at least 6 characters"),
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		photo: z
			.any()
			.optional()
			.refine(
				(file) =>
					!file || (file instanceof File && file.size <= 2 * 1024 * 1024),
				{ message: "Photo must be less than 2MB and a valid image" },
			),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type LoginFormError = BaseZodError<typeof loginFormSchema>;
export type RegisterFormError = BaseZodError<typeof registerFormSchema>;

export type ProfileData = {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	photo: Buffer | null;
	createdTime: Date;
	lastUpdateTime: Date;
	stage: { id: string; stage: string };
	quizzes: { id: string; mark: number | null }[];
};
