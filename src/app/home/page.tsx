// my-navbar-app/pages/navbar-test.tsx
import Chatbot from "@/components/Chatbot";
import { AboutComponent } from "@/components/home/AboutComponent";
import { Footer } from "@/components/home/Footer";
import { HomeComponent } from "@/components/home/HomeComponent";
import { Navbar } from "@/components/home/Navbar";
import Popup from "@/components/home/Popup";
import { TryitCard } from "@/components/home/TryitCard";
import {
	ChatbotAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
	ChatbotWithNewContextAction,
} from "@/lib/ServerAction/chatBotNLP";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExp";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Home",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function HomePage() {
	return (
		<div className="">
			<Navbar />

			<HomeComponent />
			<AboutComponent />
			<TryitCard />

			<Chatbot
				ChatbotAction={ChatbotAction}
				ChatbotExpAction={ChatbotExpAction}
				ChatbotTrArToEn={ChatbotTrArToEn}
				ChatbotTrEnToAr={ChatbotTrEnToAr}
				ChatbotWithNewContextAction={ChatbotWithNewContextAction}
			/>

			<Footer />

			<Popup />
		</div>
	);
}
