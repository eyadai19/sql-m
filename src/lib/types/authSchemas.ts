import { z } from "zod";
import { BaseZodError } from "./errorUtilities";

export const loginFormSchema = z.object({
	username: z.string().min(8),
	password: z.string().min(8).max(32),
});

export const registerFormSchema = z
	.object({
		username: z.string().min(1, "Username is required"),
		// email: z.string().email("Invalid email format"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Confirm password must be at least 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type LoginFormError = BaseZodError<typeof loginFormSchema>;
export type RegisterFormError = BaseZodError<typeof registerFormSchema>;
//eyad