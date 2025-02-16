"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

interface HintsProps {
	hints: string[];
	activeHint: number;
	onNextHint: () => void;
	tips: string[];
	showTips: boolean;
	onToggleTips: () => void;
	showHints: boolean;
	onToggleHints: () => void;
}

export default function Hints({
	hints,
	activeHint,
	onNextHint,
	tips,
	showTips,
	onToggleTips,
	showHints,
	onToggleHints,
}: HintsProps) {
	return (
		<div className="space-y-6">
			{hints.length > 0 && (
				<Collapsible open={showHints} onOpenChange={onToggleHints}>
					<CollapsibleTrigger asChild>
						<Button
							variant="outline"
							className="w-full bg-white/30 text-sailorBlue"
						>
							{showHints ? "Hide Hints" : "Show Hints"}
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent className="mt-4">
						<Card className="bg-gray-100/40">
							<CardContent className="p-4">
								{hints.slice(0, activeHint + 1).map((hint, index) => (
									<p key={index} className="mb-2 text-base text-gray-700">
										{index + 1}. {hint}
									</p>
								))}
								{activeHint < hints.length - 1 && (
									<Button
										variant="outline"
										onClick={onNextHint}
										className="mt-2 bg-white/30"
									>
										Next Hint
										<ChevronRight className="ml-2 h-4 w-4" />
									</Button>
								)}
							</CardContent>
						</Card>
					</CollapsibleContent>
				</Collapsible>
			)}

			{tips.length > 0 && (
				<Collapsible open={showTips} onOpenChange={onToggleTips}>
					<CollapsibleTrigger asChild>
						<Button
							variant="outline"
							className="w-full bg-white/30 text-sailorBlue"
						>
							{showTips ? "Hide Tips" : "Show Tips"}
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent className="mt-4">
						<Card className="bg-gray-100/40">
							<CardContent className="p-4">
								<ul className="list-disc space-y-2 pl-5">
									{tips.map((tip, index) => (
										<li key={index} className="text-base text-gray-700">
											{tip}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					</CollapsibleContent>
				</Collapsible>
			)}
		</div>
	);
}
