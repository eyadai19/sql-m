import Chatbot from "@/components/Chatbot";
import DatabaseManager from "@/components/database/DatabaseManager";
import { Navbar } from "@/components/layout/Navbar";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExp";
import {
	ChatbotAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
	ChatbotWithNewContextAction,
} from "@/lib/ServerAction/chatBotNLP";
import { logoutAction } from "../Profile/page";

import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Compiler",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function UserComp() {
	return (
		<div>
			<Navbar logoutAction={logoutAction} />
			<DatabaseManager />
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
