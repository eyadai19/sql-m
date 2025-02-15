import Chatbot from "@/components/Chatbot";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import RenderHeadings from "@/components/layout/RenderHeadings";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExp";
import {
	ChatbotAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
	ChatbotWithNewContextAction,
} from "@/lib/ServerAction/chatBotNLP";
import React from "react";
import { logoutAction } from "../Profile/page";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative h-full before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-teal-400 before:to-blue-500 before:opacity-25">
			<Navbar logoutAction={logoutAction} />
			<SidebarProvider>
				<AppSidebar
					getQuizAction={getQuizAction}
					getUnlockIndex={getUnlockIndex}
				/>
				<main className="overflow-auto">
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
				ChatbotWithNewContextAction={ChatbotWithNewContextAction}
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
		if (!user) return { field: "root", message: "User not authenticated." };

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

/*

export async function getQuizAction(
	index: number,
): Promise<string | undefined | { field: string; message: string }> {
	"use server";
	try {
		const stageId = await db.query.TB_stage.findFirst({
			where: (stage, { eq }) => eq(stage.index, index),
			columns: { id: true },
		});

		return stageId?.id;
	} catch (error) {
		console.error("Error fetching quiz:", error);
		return { field: "root", message: "Error fetching quiz" };
	}
}

export async function getUnlockIndex(): Promise<
	number | undefined | { field: string; message: string }
> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const userData = await db.query.TB_user.findFirst({
			where: (info, { eq }) => eq(info.id, user.id),
			columns: { stageId: true },
		});

		if (!userData) return undefined;

		const stage = await db.query.TB_stage.findFirst({
			where: (stage, { eq }) => eq(stage.id, userData.stageId),
			columns: { index: true },
		});

		return stage?.index;
	} catch (error) {
		console.error("Error fetching unlock index:", error);
		return { field: "root", message: "Error fetching unlock index" };
	}
}

export async function getAuthorizedPage(levelName: string): Promise<boolean> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return false;

		const [userStage, levelStage] = await Promise.all([
			db.query.TB_user.findFirst({
				where: (info, { eq }) => eq(info.id, user.id),
				columns: { stageId: true },
			}),
			db.query.TB_level.findFirst({
				where: (level, { eq }) => eq(level.level, levelName),
				columns: { stageId: true },
			}),
		]);

		if (!userStage?.stageId || !levelStage?.stageId) return false;

		const [userStageIndex, levelStageIndex] = await Promise.all([
			db.query.TB_stage.findFirst({
				where: (stage, { eq }) => eq(stage.id, userStage.stageId),
				columns: { index: true },
			}),
			db.query.TB_stage.findFirst({
				where: (stage, { eq }) => eq(stage.id, levelStage.stageId),
				columns: { index: true },
			}),
		]);

		return (
			(levelStageIndex?.index ?? Infinity) <= (userStageIndex?.index ?? -1)
		);
	} catch (error) {
		console.error("Error fetching authorized page:", error);
		return false;
	}
}

export async function getAuthorizedQuiz(stageId: string): Promise<boolean> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return false;

		const [userStage, targetStage] = await Promise.all([
			db.query.TB_user.findFirst({
				where: (info, { eq }) => eq(info.id, user.id),
				columns: { stageId: true },
			}),
			db.query.TB_stage.findFirst({
				where: (stage, { eq }) => eq(stage.id, stageId),
				columns: { index: true },
			}),
		]);

		if (!userStage?.stageId || !targetStage) return false;

		const userStageIndex = await db.query.TB_stage.findFirst({
			where: (stage, { eq }) => eq(stage.id, userStage.stageId),
			columns: { index: true },
		});

		return (targetStage.index ?? Infinity) <= (userStageIndex?.index ?? -1);
	} catch (error) {
		console.error("Error fetching authorized quiz:", error);
		return false;
	}
}

*/
