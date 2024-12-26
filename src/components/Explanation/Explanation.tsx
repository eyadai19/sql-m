"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	AlertCircle,
	BookOpen,
	ChevronDown,
	Code,
	ExternalLink,
	Lightbulb,
} from "lucide-react";
import { useState } from "react";
import CodeBlock from "./CodeBlock";
import ExplanationHeader from "./ExplanationHeader";
import ExplanationSection from "./ExplanationSection";
import type { ExplanationProps } from "./types";

export default function Explanation({
	title = "Getting Started",
	howItWorks,
	syntax,
	example,
	sections = [],
	notes,
	additionalResources = [],
	difficulty = "Beginner",
	tags = [],
}: ExplanationProps) {
	const [isResourcesOpen, setIsResourcesOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("explanation");
	const [expandedSections, setExpandedSections] = useState<Set<number>>(
		new Set(),
	);

	const toggleSection = (index: number) => {
		const newExpanded = new Set(expandedSections);
		if (expandedSections.has(index)) {
			newExpanded.delete(index);
		} else {
			newExpanded.add(index);
		}
		setExpandedSections(newExpanded);
	};

	return (
		<Card className="mx-auto mb-3 w-full max-w-4xl bg-white/40 shadow-lg backdrop-blur-xl">
			<ExplanationHeader title={title} difficulty={difficulty} tags={tags} />

			<CardContent className="space-y-6 p-4 sm:p-6">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger
							value="explanation"
							className="flex items-center gap-2"
						>
							<BookOpen className="hidden h-4 w-4 sm:block" />
							Explanation
						</TabsTrigger>
						<TabsTrigger
							value="implementation"
							className="flex items-center gap-2"
						>
							<Code className="hidden h-4 w-4 sm:block" />
							Implementation
						</TabsTrigger>
					</TabsList>

					<TabsContent value="explanation" className="mt-6 space-y-6">
						<section className="space-y-2">
							<h2 className="flex items-center gap-2 text-lg font-semibold text-sailorBlue sm:text-xl">
								<Lightbulb className="h-5 w-5" />
								How It Works
							</h2>
							<p className="text-sm text-sailorBlue sm:text-base">
								{howItWorks}
							</p>
						</section>

						{sections.length > 0 && (
							<section className="space-y-4">
								{sections.map((section, index) => (
									<ExplanationSection
										key={index}
										section={section}
										index={index}
										isExpanded={expandedSections.has(index)}
										onToggle={() => toggleSection(index)}
									/>
								))}
							</section>
						)}

						<section className="space-y-2">
							<h2 className="text-lg font-semibold text-sailorBlue sm:text-xl">
								Notes & Tips
							</h2>
							<Card className="border-sailorBlue/40 bg-gray-100/40">
								<CardContent className="p-4">
									<ul className="list-disc space-y-2 pl-4">
										{notes.map((note, index) => (
											<li
												key={index}
												className="flex items-start gap-2 text-sm text-sailorBlue sm:text-base"
											>
												<AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-sailorBlue" />
												<span>{note}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</section>
					</TabsContent>

					<TabsContent value="implementation" className="mt-6 space-y-6">
						<section className="space-y-2">
							<h2 className="text-lg font-semibold text-sailorBlue sm:text-xl">
								Syntax
							</h2>
							<CodeBlock initialCode={syntax} />
						</section>

						<section className="space-y-2">
							<h2 className="text-lg font-semibold text-sailorBlue sm:text-xl">
								Example
							</h2>
							<CodeBlock initialCode={example.code} />
							<p className="mt-2 text-sm text-sailorBlue sm:text-base">
								{example.explanation}
							</p>

							{example.liveDemo && (
								<Card className="mt-4 border-2 border-sailorBlue/10 p-4">
									<h3 className="mb-4 text-lg font-semibold text-sailorBlue">
										Live Demo
									</h3>
									<div className="rounded-lg bg-white p-4">
										{example.liveDemo}
									</div>
								</Card>
							)}
						</section>
					</TabsContent>
				</Tabs>

				{additionalResources.length > 0 && (
					<Collapsible
						open={isResourcesOpen}
						onOpenChange={setIsResourcesOpen}
						className="w-full"
					>
						<CollapsibleTrigger asChild>
							<Button
								variant="outline"
								className="flex w-full items-center justify-between bg-white/30 p-4"
							>
								<span className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									Additional Resources
								</span>
								<ChevronDown
									className={cn(
										"h-4 w-4 transition-transform duration-200",
										isResourcesOpen && "rotate-180",
									)}
								/>
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-4">
							<Card className="bg-gray-100/40">
								<CardContent className="p-4">
									<ul className="space-y-2">
										{additionalResources.map((resource, index) => (
											<li key={index}>
												<a
													href={resource.url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 text-sm text-sailorBlue transition-colors hover:text-sailorBlue/80"
												>
													<ExternalLink className="h-4 w-4" />
													{resource.title}
												</a>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</CollapsibleContent>
					</Collapsible>
				)}
			</CardContent>
		</Card>
	);
}
