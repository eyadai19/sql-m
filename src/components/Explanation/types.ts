export interface Section {
	title?: string;
	content: string;
	image?: {
		url: string;
		alt: string;
		caption?: string;
	};
	code?: string;
	examples?: {
		title: string;
		code: string;
		explanation: string;
	}[];
}

export interface ExplanationProps {
	title?: string;
	howItWorks: string;
	syntax: string;
	example: {
		code: string;
		explanation: string;
		liveDemo?: React.ReactNode;
	};
	sections?: Section[];
	notes: string[];
	additionalResources?: {
		title: string;
		url: string;
	}[];
	difficulty?: "Beginner" | "Intermediate" | "Advanced";
	tags?: string[];
}
