// my-navbar-app/pages/_app.tsx
import type { AppProps } from 'next/app';
import { Navbar } from "@/components/Navbar";
import { AboutComponent } from "@/components/AboutComponent";
import { HomeComponent } from "@/components/HomeComponent";
import { TryitCard } from "@/components/TryitCard";
import { Footer } from "@/components/Footer";
import Chatbot from '@/components/Chatbot';
import { ChatbotAction } from '@/lib/ServerAction/chatBotNLP';


// my-navbar-app/pages/navbar-test.tsx

export default function HomePage() {
	return (
		<div className= "" >
			<Navbar />

			<HomeComponent />

			<AboutComponent />
			
			<TryitCard/>
			
			<Chatbot ChatbotAction={ChatbotAction}/>

			<Footer/>

		</div>
	);
}
