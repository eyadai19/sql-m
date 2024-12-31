"use client";
import { X } from "lucide-react";
import { useState } from "react";

export function WelcomeBanner() {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div className="relative mb-6 rounded-lg bg-gradient-to-r from-[#00203F] to-[#ADF0D1] p-6 text-white shadow-lg">
			<button
				onClick={() => setIsVisible(false)}
				className="absolute right-4 top-4 text-white/80 transition-colors hover:text-white"
			>
				<X className="h-5 w-5" />
			</button>
			<h1 className="mb-2 text-3xl font-bold">
				Welcome to SQLMentor Community!
			</h1>
			<p className="text-lg text-white/90">
				Join our community of SQL enthusiasts. Share your knowledge, ask
				questions, and learn together.
			</p>
		</div>
	);
}
