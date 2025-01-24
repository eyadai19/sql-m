import Chatbot from "@/components/Chatbot";
import FetchTables from "@/components/database/FetchTables";
import { Navbar } from "@/components/layout/Navbar";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExp";
import {
	ChatbotAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
	ChatbotWithNewContextAction,
} from "@/lib/ServerAction/chatBotNLP";
import { Metadata } from "next";
import { logoutAction } from "../Profile/page";
export const metadata: Metadata = {
	title: "SQLMentor - DataBase Exeplorer",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function DataBaseExeplorer() {
	return (
		<div className="">
			<Navbar logoutAction={logoutAction} />
			<FetchTables />
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
