import { Footer } from "@/components/home/Footer";
import { HomeComponent } from "@/components/home/HomeComponent";
import { Navbar } from "@/components/home/Navbar";
import { TryitCard } from "@/components/home/TryitCard";
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
			<TryitCard />
			<Footer />
		</div>
	);
}
