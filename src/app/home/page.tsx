// my-navbar-app/pages/_app.tsx
import type { AppProps } from 'next/app';
import { Navbar } from "@/components/Navbar";
import { AboutComponent } from "@/components/AboutComponent";
import { HomeComponent } from "@/components/HomeComponent";
import { TryitCard } from "@/components/TryitCard";
import { Footer } from "@/components/Footer";

// my-navbar-app/pages/navbar-test.tsx

export default function HomePage() {
	return (
		<div className="h-screen bg-gray-100">
			<Navbar />

			<HomeComponent />

			<AboutComponent />
			
			<TryitCard/>

			<Footer/>
		</div>
	);
}
