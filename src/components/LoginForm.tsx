"use client";

import { LoginFormError, loginFormSchema } from "@/lib/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export function LoginForm({
	loginAction,
}: {
	loginAction: (
		input: z.infer<typeof loginFormSchema>,
	) => Promise<LoginFormError | undefined>;
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false); // حالة التحميل عند الضغط على الزر

	useEffect(() => {
		async function checkLoginStatus() {
			try {
				const response = await fetch("/api/is_logged_in");

				if (!response.ok) {
					console.error("Failed to fetch login status:", response.statusText);
					setIsLoading(false);
					return;
				}

				const data = await response.json();
				if (data.isLoggedIn) {
					router.push("/Profile");
				} else {
					setIsLoading(false);
				}
			} catch (error) {
				console.error("An error occurred while checking login status:", error);
				setIsLoading(false);
			}
		}

		checkLoginStatus();
	}, [router]);

	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		setIsSubmitting(true); 
		const error = await loginAction(values);

		if (error) {
			if (error.field === "username") {
				form.setError("username", { message: error.message });
			} else if (error.field === "password") {
				form.setError("password", { message: error.message });
			} else if (error.field === "root") {
				form.setError("root", { message: error.message });
			}
			setIsSubmitting(false); // إيقاف التحميل
		} else {
			router.push("/Profile");
		}
	}

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	return (
		<div
			className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#00203F] to-[#00001a]"
			style={{
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div
				className="flex w-[90%] max-w-3xl items-center justify-center rounded-lg p-6 shadow-lg backdrop-blur-md"
				style={{
					backgroundImage: "url('../image/authImage/AuthBG.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "480px",
					boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.2)",
					transform: "translateY(-10px)",
				}}
			>
				<div className="flex w-full flex-col items-center">
					<h2 className="mb-6 text-3xl font-semibold text-white">
						Welcome Again
					</h2>

					<div
						className="flex w-full max-w-sm flex-col rounded-lg bg-gradient-to-b from-[#003a57] to-[#004a63] p-6"
						style={{
							height: "250px",
							boxShadow:
								"0 10px 15px -3px rgba(0, 32, 63, 0.5), 0 4px 6px rgba(0, 32, 63, 0.3)",
							overflow: "auto",
						}}
					>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="flex-grow space-y-6"
							>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													placeholder="Email Address"
													{...field}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
												/>
											</FormControl>
											<FormMessage className="text-red-500" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => {
										const [showPassword, setShowPassword] = useState(false); // حالة لعرض أو إخفاء كلمة المرور
										return (
											<FormItem>
												<FormControl>
													<div className="relative">
														<Input
															type={showPassword ? "text" : "password"} // تغيير نوع الحقل بناءً على الحالة
															placeholder="Password"
															{...field}
															className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
														/>
														<button
															type="button"
															onClick={() => setShowPassword(!showPassword)} // تبديل الحالة عند الضغط
															className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
														>
															{showPassword ? (
																<EyeOff className="h-5 w-5" /> // أيقونة إخفاء كلمة المرور
															) : (
																<Eye className="h-5 w-5" /> // أيقونة عرض كلمة المرور
															)}
														</button>
													</div>
												</FormControl>
												<FormMessage className="text-red-500" />
											</FormItem>
										);
									}}
								/>

								<Button
									disabled={isSubmitting}
									className="w-full rounded bg-[#ADF0D1] py-2 text-[#00203F] hover:text-[#ADF0D1]"
									type="submit"
								>
									{isSubmitting ? (
										<div className="flex items-center justify-center">
											<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-[#00203F]"></div>
										</div>
									) : (
										"LOG IN"
									)}
								</Button>
							</form>
						</Form>

						{/* النص "Don't have an account? Register." */}
						<div className="mt-4 text-center">
							<span className="text-sm text-white">
								Don't have an account?{" "}
							</span>
							<Link
								href="/register"
								className="text-sm font-medium text-blue-500 hover:underline"
							>
								Register.
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
