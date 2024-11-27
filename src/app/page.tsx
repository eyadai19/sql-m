"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
	useEffect(() => {
		redirect("/home");
	}, []);

	return (
		<div>
			<p>Redirecting...</p>
		</div>
	);
}
