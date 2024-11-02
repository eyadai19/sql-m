"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { allPath } from "@/utils/path";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar className="h-full w-64 bg-gray-100 p-4">
			<SidebarContent>
				<SidebarMenu>
					{allPath.map((group, groupIndex) => (
						<SidebarGroup key={groupIndex}>
							<SidebarGroupLabel>{group.name}</SidebarGroupLabel>
							<SidebarGroupContent>
								{group.data.map((page, pageIndex) => {
									const isActive = pathname.endsWith(
										page.path.split("/").pop() || "",
									);
									return (
										<SidebarMenuItem key={pageIndex}>
											<SidebarMenuButton asChild>
												<Link
													href={page.path}
													prefetch={false}
													className={`block rounded-md p-2 ${
														isActive
															? "bg-gray-300 font-semibold text-blue-800"
															: "text-gray-800"
													} hover:bg-gray-200`}
												>
													{page.name}
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarGroupContent>
						</SidebarGroup>
					))}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
