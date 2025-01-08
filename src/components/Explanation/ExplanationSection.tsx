"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown, Info } from "lucide-react";
import CodeBlock from "./CodeBlock";
import { Section } from "./types";

interface ExplanationSectionProps {
	section: Section;
	index: number;
	isExpanded: boolean;
	onToggle: () => void;
}

export default function ExplanationSection({
	section,
	index,
	isExpanded,
	onToggle,
}: ExplanationSectionProps) {
	return (
		<Collapsible open={isExpanded} onOpenChange={onToggle}>
			<Card className="border-sailorBlue/40 bg-mint/15 transition-colors hover:border-sailorBlue/60">
				<CollapsibleTrigger asChild>
					<Button
						variant="ghost"
						className="flex w-full items-center justify-between p-4 hover:bg-sailorBlue/5"
					>
						<span className="flex items-center gap-2 font-medium text-sailorBlue">
							<Info className="h-4 w-4" />
							{section.title || `Section ${index + 1}`}
						</span>
						<ChevronDown
							className={cn(
								"h-4 w-4 text-sailorBlue transition-transform duration-200",
								isExpanded && "rotate-180",
							)}
						/>
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<CardContent className="space-y-4 px-4 pb-4 pt-0">
						{section.image && (
							<div className="mb-4 overflow-hidden rounded-lg border border-sailorBlue/10">
								<img
									src={section.image.url}
									alt={section.image.alt}
									className="h-auto max-h-[400px] w-full object-contain transition-transform hover:scale-105"
									loading="lazy"
								/>
								{section.image.caption && (
									<p className="mt-2 text-center text-sm italic text-sailorBlue/80">
										{section.image.caption}
									</p>
								)}
							</div>
						)}
						<div className="prose prose-sailorBlue max-w-none">
							<p className="text-sm leading-relaxed text-sailorBlue sm:text-base">
								{section.content}
							</p>
						</div>
						{section.code && (
							<div className="mt-4">
								<CodeBlock initialCode={section.code} />
							</div>
						)}
					</CardContent>
				</CollapsibleContent>
			</Card>
		</Collapsible>
	);
}
