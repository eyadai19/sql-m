"use client";

import { LoginFormError } from "@/lib/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const loginFormSchema = z.object({
	username: z.string(),
	password: z.string().min(8).max(32),
});

export function LoginForm({
	loginAction,
}: {
	loginAction: (
		input: z.infer<typeof loginFormSchema>,
	) => Promise<LoginFormError | undefined>;
}) {
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		const error = await loginAction(values);

		if (error) {
			form.setError(
				error.field,
				{ message: error.message },
				{ shouldFocus: true },
			);
			console.log("error");
			
			return;
		}
		console.log("suc");
		
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
				<div className="flex flex-col gap-1">
					<span className="text-2xl font-medium">تسجيل الدخول</span>
					<span className="text-sm text-muted-foreground">
						ليس لديك حساب؟{" "}
						<Link className="font-medium text-blue-400" href="/register">
							انشاء حساب جديد{" "}
						</Link>
						.
					</span>
				</div>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="اسم  المستخدم" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type="password" placeholder="كلمة المرور" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="space-y-2">
					<Button
						disabled={form.formState.isSubmitting}
						className="w-full"
						type="submit"
					>
						تسجيل الدخول
					</Button>

					<Button
						disabled={form.formState.isSubmitting}
						className="w-full"
						type="submit"
						variant="outline"
					>
						تسجيل الدخول كضيف
					</Button>
				</div>
			</form>
		</Form>
	);
}
