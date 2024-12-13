// my-navbar-app/pages/_app.tsx
import { AboutComponent } from "@/components/AboutComponent";
import Chatbot from "@/components/Chatbot";
import { Footer } from "@/components/Footer";
import { HomeComponent } from "@/components/HomeComponent";
import { Navbar } from "@/components/Navbar";
import { TryitCard } from "@/components/TryitCard";
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
