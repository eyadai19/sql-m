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
		<Sidebar className="h-full w-60 bg-sailorBlue p-2 border-0">
			<SidebarContent>
				<SidebarMenu className="bg-sailorBlue p-0 border-0">
					{allPath.map((group, groupIndex) => (
						<SidebarGroup key={groupIndex}>
							<SidebarGroupLabel className="text-gray-400 uppercase ">{group.name}</SidebarGroupLabel>
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
													className={`block rounded-md p-2 hover:bg-mint my-1 text-sm ${
														isActive
															? "bg-mint text-sailorBlue "
															: "text-gray-300"
													}`}
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
