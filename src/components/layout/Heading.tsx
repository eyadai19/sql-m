import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
interface headingProps {
	title: string;
	subtitle?: string;
}
export default function Heading({ title, subtitle }: headingProps) {
	return (
		<Card className="mx-auto w-full max-w-4xl overflow-hidden border-0">
			<div className="bg-gradient-to-br from-sailorBlue via-lightSailorBlue to-mint">
				<CardHeader>
					<CardTitle className="mb-1 text-3xl font-bold text-white">
						{title}
					</CardTitle>
					<CardDescription className="text-lg text-gray-200">
						{subtitle}
					</CardDescription>
				</CardHeader>
			</div>
		</Card>
	);
}
