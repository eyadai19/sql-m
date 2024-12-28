"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
	useEffect(() => {
		redirect("/home");
	}, []);

	return (
	
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ADF0D1]"></div>
            </div>
        );
	
}
