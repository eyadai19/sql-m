import FetchTables from "@/components/database/FetchTables";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import { logoutAction } from "../Profile/page";
import {
	ChatbotAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
	ChatbotWithNewContextAction,
} from "@/lib/ServerAction/chatBotNLP";
import Chatbot from '@/components/Chatbot';
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExp";
import { Metadata } from "next";
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
			<ProfileNavbar logoutAction={logoutAction} />
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
