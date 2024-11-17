import { AppSidebar } from "@/components/AppSidebar";
import RenderHeadings from "@/components/RenderHeadings";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";


export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="">
			<div className="fixed left-0 top-0 -z-20 min-h-screen w-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-25"></div>
			<SidebarProvider>
				<AppSidebar />
				<main>
					<SidebarTrigger />
					<RenderHeadings />
					{children}
				</main>
			</SidebarProvider>
		</div>
	);
}
