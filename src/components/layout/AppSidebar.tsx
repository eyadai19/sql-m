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
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";

export function AppSidebar({
	getQuizAction,
	getUnlockIndex,
}: {
	getQuizAction: (
		index: number,
	) => Promise<string | undefined | { field: string; message: string }>;
	getUnlockIndex: () => Promise<
		number | undefined | { field: string; message: string }
	>;
}) {
	const pathname = usePathname();
	const [quizLinks, setQuizLinks] = useState<string[]>([]);
	const [unlockIndex, setUnlockIndex] = useState<number>(0);

	useEffect(() => {
		async function fetchQuizLinks() {
			const links = await Promise.all(
				allPath.map((_, groupIndex) => getQuizAction(groupIndex)),
			);
			setQuizLinks(
				links.map((link) => (typeof link === "string" ? link : "error")),
			);
		}

		async function fetchUnlockIndex() {
			const result = await getUnlockIndex();

			// تحقق مما إذا كان result رقمًا
			if (typeof result === "number") {
				setUnlockIndex(result);
			} else {
				console.error("Unlock index is invalid:", result);
				setUnlockIndex(0);
			}
		}

		fetchQuizLinks();
		fetchUnlockIndex();
	}, [getQuizAction, getUnlockIndex]);

	return (
		<Sidebar className="h-full w-60 border-0 bg-sailorBlue">
			<SidebarContent
				className=""
				style={{
					overflow: "auto", // يسمح بالتمرير
					scrollbarWidth: "none", // لإخفاء شريط التمرير في Firefox
					msOverflowStyle: "none", // لإخفاء شريط التمرير في Internet Explorer
				}}
			>
				<SidebarMenu className="mt-[70px] border-0 bg-sailorBlue p-0">
					{allPath.map((group, groupIndex) => (
						<SidebarGroup key={groupIndex}>
							{/* تغيير لون العنوان الرئيسي لكل قسم */}
							<SidebarGroupLabel className="mb-2 text-sm font-semibold uppercase text-mint">
								{group.name}
							</SidebarGroupLabel>
							<SidebarGroupContent>
								{group.data.map((page, pageIndex) => {
									const isLocked = groupIndex > unlockIndex; // الآن unlockIndex مضمون رقميًا
									const isActive = pathname.endsWith(
										page.path.split("/").pop() || "",
									);

									return (
										<SidebarMenuItem key={pageIndex}>
											{isLocked ? (
												<div
													className={`my-1 flex cursor-not-allowed items-center rounded-md p-2 text-sm text-gray-400`}
												>
													<FaLock className="mr-2" />
													<span>{page.name}</span>
												</div>
											) : (
												<SidebarMenuButton asChild>
													<Link
														href={page.path}
														prefetch={false}
														className={`my-1 flex items-center rounded-md p-2 text-sm hover:bg-mint ${
															isActive
																? "bg-mint text-sailorBlue"
																: "text-gray-300"
														}`}
													>
														{page.name}
													</Link>
												</SidebarMenuButton>
											)}
										</SidebarMenuItem>
									);
								})}
								{/* زر Quiz في نهاية كل قسم */}
								<div className="mt-1">
									{groupIndex <= unlockIndex ? (
										<Link
											href={`../quiz/${quizLinks[groupIndex]}` || "#"}
											className="hover:bg-mint-light block w-full rounded-md bg-mint py-1 text-center text-sm font-bold text-sailorBlue opacity-50 hover:opacity-100"
										>
											Quiz
										</Link>
									) : (
										<div className="block w-full cursor-not-allowed rounded-md bg-gray-500 py-2 text-center text-sm font-bold text-gray-300">
											<FaLock className="mr-1 inline" /> Quiz Locked
										</div>
									)}
								</div>
								<br />
							</SidebarGroupContent>
						</SidebarGroup>
					))}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
