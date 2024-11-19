"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import Link from "next/link";
import { registerFormSchema } from "@/lib/types/authSchemas";

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
		},
	});

	const [preview, setPreview] = useState<string | null>(null);

	// Handle image upload
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setPreview(reader.result as string);
			reader.readAsDataURL(file);
		} else {
			setPreview(null);
		}
	};

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		const error = await registerAction(values);
		if (error) {
			form.setError(error.field, { message: error.message });
			return;
		}
	}

	return (
		<div
			className="flex min-h-screen items-center justify-center bg-cover bg-center"
			style={{ backgroundImage: "url('/image/authImage/RegisterImage.jpg')" }}
		>
			<div className="w-full max-w-md rounded-lg bg-[#00203F]/90 p-8 shadow-lg">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Header */}
						<div className="text-center">
							<h1 className="text-2xl font-semibold text-[#ADF0D1]">
								Create an Account
							</h1>
							<p className="text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link href="/login" className="font-medium text-blue-400">
									Log in
								</Link>
							</p>
						</div>

						{/* Profile Picture */}
						<div className="flex flex-col items-center">
							<label htmlFor="photo" className="relative cursor-pointer">
								<div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#ADF0D1] bg-[#003A63]">
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
							<span className="mt-2 text-sm text-muted-foreground">
								Click to upload a photo
							</span>
						</div>

						{/* First Name and Last Name */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="First Name" {...field} />
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
											<Input placeholder="Last Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Username */}
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="Username" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="password" placeholder="Password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Confirm Password */}
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
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full bg-[#ADF0D1] text-[#00203F]"
						>
							Create Account
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
