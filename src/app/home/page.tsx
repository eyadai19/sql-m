// my-navbar-app/pages/navbar-test.tsx
import { Navbar } from "@/components/home/Navbar";
import { HomeComponent } from "@/components/home/HomeComponent";
import { AboutComponent } from "@/components/home/AboutComponent";
import { TryitCard } from "@/components/home/TryitCard";
import Chatbot from "@/components/Chatbot";
import { Footer } from "@/components/home/Footer";
import {
  ChatbotAction,
  ChatbotExpAction,
  ChatbotTrArToEn,
  ChatbotTrEnToAr,
} from "@/lib/ServerAction/chatBotNLP";
import Popup from "@/components/home/Popup";

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
