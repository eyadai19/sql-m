"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
	const router = useRouter();
	useEffect(() => {
		router.push("/home");
	}, []);

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-[#ADF0D1]"></div>
		</div>
	);
}
