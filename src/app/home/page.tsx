// my-navbar-app/pages/_app.tsx
import { AboutComponent } from "@/components/home/AboutComponent";
import Chatbot from "@/components/Chatbot";
import { Footer } from "@/components/home/Footer";
import { HomeComponent } from "@/components/home/HomeComponent";
import { Navbar } from "@/components/home/Navbar";
import { TryitCard } from "@/components/home/TryitCard";
import {
	ChatbotAction,
	ChatbotExpAction,
	ChatbotTrArToEn,
	ChatbotTrEnToAr,
} from "@/lib/ServerAction/chatBotNLP";

// my-navbar-app/pages/navbar-test.tsx

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
			/>

			<Footer />
		</div>
	);
}
