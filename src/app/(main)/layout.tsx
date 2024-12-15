import { AppSidebar } from "@/components/AppSidebar";
import Chatbot from "@/components/Chatbot";
import { ProfileNavbar } from "@/components/ProfileNavbar";
import RenderHeadings from "@/components/RenderHeadings";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	ChatbotAction,
	ChatbotExpAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
} from "@/lib/ServerAction/chatBotNLP";
import React from "react";
import { logoutAction } from "../Profile/page";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="fixed left-0 top-0 -z-20 min-h-screen w-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-25"></div>
			<ProfileNavbar logoutAction={logoutAction} />
			<SidebarProvider>
				<AppSidebar
					getQuizAction={getQuizAction}
					getUnlockIndex={getUnlockIndex}
				/>
				<main>
					<SidebarTrigger />
					<RenderHeadings />
					{children}
				</main>
			</SidebarProvider>
			<Chatbot
				ChatbotAction={ChatbotAction}
				ChatbotExpAction={ChatbotExpAction}
				ChatbotTrArToEn={ChatbotTrArToEn}
				ChatbotTrEnToAr={ChatbotTrEnToAr}
			/>
		</div>
	);
}

export async function getQuizAction(
	index: number,
): Promise<string | undefined | { field: string; message: string }> {
	"use server";
	try {
		const stage = await db.query.TB_stage.findFirst({
			where: (stage, { eq }) => eq(stage.index, index),
		});
		if (!stage) return;
		const stageId = stage.id;

		return stageId;
	} catch (error) {
		return { field: "root", message: "Error fetching quiz" };
	}
}

export async function getUnlockIndex(): Promise<
	number | undefined | { field: string; message: string }
> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return;
		const userInfo = await db.query.TB_user.findFirst({
			where: (info, { eq }) => eq(info.id, user.id),
			with: {
				stage: true,
			},
		});
		if (!userInfo) return;

		const stageIndex = userInfo.stage.index;

		return stageIndex;
	} catch (error) {
		return { field: "root", message: "error" };
	}
}

export async function getAuthorizedPage(
	levelName: string,
): Promise<boolean | undefined> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return;
		const userInfo = await db.query.TB_user.findFirst({
			where: (info, { eq }) => eq(info.id, user.id),
			with: {
				stage: true,
			},
		});
		if (!userInfo) return;

		const stageIndex = userInfo.stage.index;

		const level = await db.query.TB_level.findFirst({
			where: (level, { eq }) => eq(level.level, levelName),
			with: {
				stage: true,
			},
		});
		if (!level) return;

		return stageIndex >= level.stage.index;
	} catch (error) {
		return false;
	}
}

export async function getAuthorizedQuiz(
	stageId: string,
): Promise<boolean | undefined> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return;
		const userInfo = await db.query.TB_user.findFirst({
			where: (info, { eq }) => eq(info.id, user.id),
			with: {
				stage: true,
			},
		});
		if (!userInfo) return;

		const stageIndex = userInfo.stage.index;

		const stage = await db.query.TB_stage.findFirst({
			where: (stage, { eq }) => eq(stage.id, stageId),
		});
		if (!stage) return;

		return stageIndex >= stage.index;
	} catch (error) {
		return false;
	}
}
