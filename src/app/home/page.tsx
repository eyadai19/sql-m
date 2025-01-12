// my-navbar-app/pages/navbar-test.tsx
import { Navbar } from "@/components/home/Navbar";
import { HomeComponent } from "@/components/home/HomeComponent";
import { AboutComponent } from "@/components/home/AboutComponent";
import { TryitCard } from "@/components/home/TryitCard";
import Chatbot from "@/components/Chatbot";
import { Footer } from "@/components/home/Footer";
import {
  ChatbotAction,
  ChatbotTrArToEn,
  ChatbotTrEnToAr,
} from "@/lib/ServerAction/chatBotNLP";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExp";
import Popup from "@/components/home/Popup";
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
      />

      <Footer />

      <Popup />
    </div>
  );
}
