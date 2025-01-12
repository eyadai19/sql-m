import { Card } from "@/components/QuickChallenges";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Quiz Chalenge",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function QuickChalenge() {
	return <Card />;
}
