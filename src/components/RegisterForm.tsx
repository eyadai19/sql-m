"use client";

import { registerFormSchema } from "@/lib/types/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export default function RegisterForm({
	registerAction,
}: {
	registerAction: (
		input: z.infer<typeof registerFormSchema>,
	) => Promise<any | undefined>;
}) {
	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			firstName: "",
			lastName: "",
			password: "",
			confirmPassword: "",
			photo: null,
		},
	});

	const [preview, setPreview] = useState<string | null>(null);
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

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
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setPhotoFile(file);
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as ArrayBuffer;
				const blob = new Blob([result], { type: file.type });
				const previewUrl = URL.createObjectURL(blob);
				setPreview(previewUrl);
			};
			reader.readAsArrayBuffer(file);
		} else {
			setPreview(null);
			setPhotoFile(null);
		}
	};

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		let photoBase64: string | null = null;

		if (photoFile) {
			const arrayBuffer = await photoFile.arrayBuffer();
			const photoBuffer = Buffer.from(arrayBuffer);

			photoBase64 = photoBuffer.toString("base64");
		}

		const error = await registerAction({
			...values,
			photo: photoBase64,
		});

		if (error) {
			form.setError(error.field, { message: error.message });
			return;
		}
	}
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ADF0D1]"></div>
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
					backgroundImage: "url('../image/authImage/RegisterBG.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "530px",
					boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.2)",
					transform: "translateY(-10px)",
				}}
			>
				<div className="flex w-full flex-col items-center">
					<h2 className="m-3 text-3xl font-semibold text-white">Join us!</h2>
					<div
						className="w-full max-w-sm rounded-lg bg-gradient-to-b from-[#003a57] to-[#004a63] p-6"
						style={{
							height: "450px",
							boxShadow:
								"0 10px 15px -3px rgba(0, 32, 63, 0.5), 0 4px 6px rgba(0, 32, 63, 0.3)",
						}}
					>
						<div className="mb-3 flex flex-col items-center">
							<label htmlFor="photo" className="relative cursor-pointer">
								<div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#afafaf] bg-[#003A63]">
									{preview ? (
										<img
											src={preview}
											alt="Profile Preview"
											className="h-full w-full object-cover"
										/>
									) : (
										<span className="text-lg text-white">+</span>
									)}
								</div>
								<input
									id="photo"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
								/>
							</label>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<div className="mb-6 grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder="First Name"
														{...field}
														className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="lastName"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder="Last Name"
														{...field}
														className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													placeholder="Username"
													{...field}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
												/>
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
												<Input
													type="password"
													placeholder="Password"
													{...field}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="password"
													placeholder="Confirm Password"
													{...field}
													className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full bg-[#ADF0D1] text-[#00203F] hover:text-[#ADF0D1]"
								>
									Create Account
								</Button>
							</form>
						</Form>

						<div className="m-2 text-center">
							<span className="text-sm text-white">
								Already have an account?{" "}
							</span>
							<Link
								href="/login"
								className="text-sm font-medium text-blue-500 hover:underline"
							>
								Login.
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
