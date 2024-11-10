import { AppSidebar } from "@/components/AppSidebar";
import Heading from "@/components/Heading";
import RenderHeadings from "@/components/RenderHeadings";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="">
			<div className="bg-gradient-to-r from-teal-400 to-blue-500 fixed min-h-screen w-full -z-20 opacity-25  top-0 left-0"></div>
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
};
