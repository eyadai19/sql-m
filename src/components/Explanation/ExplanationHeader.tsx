"use client";

import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ExplanationHeaderProps {
	title: string;
	difficulty: "Beginner" | "Intermediate" | "Advanced";
	tags: string[];
}

export default function ExplanationHeader({
	title,
	difficulty,
	tags,
}: ExplanationHeaderProps) {
	const difficultyColor = {
		Beginner: "bg-green-100 text-green-800",
		Intermediate: "bg-yellow-100 text-yellow-800",
		Advanced: "bg-red-100 text-red-800",
	}[difficulty];

	return (
		<CardHeader className="space-y-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<CardTitle className="text-xl font-bold text-sailorBlue sm:text-2xl">
					{title}
				</CardTitle>
				<Badge className={cn("self-start sm:self-auto", difficultyColor)}>
					{difficulty}
				</Badge>
			</div>
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<Badge key={tag} variant="secondary" className="text-xs">
							{tag}
						</Badge>
					))}
				</div>
			)}
		</CardHeader>
	);
}
