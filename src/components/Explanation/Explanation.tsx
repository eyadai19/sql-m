import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	Info,
	Lightbulb,
} from "lucide-react";
import React, { useState } from "react";
import CodeBlock from "./CodeBlock";

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

	const difficultyColor = {
		Beginner: "bg-green-100 text-green-800",
		Intermediate: "bg-yellow-100 text-yellow-800",
		Advanced: "bg-red-100 text-red-800",
	}[difficulty];

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
			<CardHeader className="space-y-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-2xl font-bold text-sailorBlue">
						{title}
					</CardTitle>
					<Badge className={cn("ml-2", difficultyColor)}>{difficulty}</Badge>
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

			<CardContent className="space-y-6">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger
							value="explanation"
							className="flex items-center gap-2"
						>
							<BookOpen className="h-4 w-4" />
							Explanation
						</TabsTrigger>
						<TabsTrigger
							value="implementation"
							className="flex items-center gap-2"
						>
							<Code className="h-4 w-4" />
							Implementation
						</TabsTrigger>
					</TabsList>

					<TabsContent value="explanation" className="mt-6 space-y-6">
						<section className="space-y-2">
							<h2 className="flex items-center gap-2 text-xl font-semibold text-sailorBlue">
								<Lightbulb className="h-5 w-5" />
								How It Works
							</h2>
							<p className="text-base text-sailorBlue">{howItWorks}</p>
						</section>

						{sections.length > 0 && (
							<section className="space-y-4">
								{sections.map((section, index) => (
									<Collapsible
										key={index}
										open={expandedSections.has(index)}
										onOpenChange={() => toggleSection(index)}
									>
										<Card className="border-sailorBlue/40 transition-colors hover:border-sailorBlue/60">
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
															expandedSections.has(index) && "rotate-180",
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
																className="w-full object-cover transition-transform hover:scale-105"
															/>
															{section.image.caption && (
																<p className="mt-2 text-center text-sm italic text-sailorBlue/80">
																	{section.image.caption}
																</p>
															)}
														</div>
													)}
													<div className="prose prose-sailorBlue max-w-none">
														<p className="leading-relaxed text-sailorBlue">
															{section.content}
														</p>
													</div>
													{section.code && (
														<div className="mt-4">
															<CodeBlock initialCode={section.code} />
														</div>
													)}
													{section.examples && section.examples.length > 0 && (
														<div className="mt-4 space-y-4">
															{section.examples.map((example, idx) => (
																<div key={idx} className="space-y-2">
																	<h4 className="text-sm font-medium text-sailorBlue">
																		{example.title}
																	</h4>
																	<CodeBlock initialCode={example.code} />
																	<p className="mt-2 text-sm text-sailorBlue/80">
																		{example.explanation}
																	</p>
																</div>
															))}
														</div>
													)}
												</CardContent>
											</CollapsibleContent>
										</Card>
									</Collapsible>
								))}
							</section>
						)}

						<section className="space-y-2">
							<h2 className="text-xl font-semibold text-sailorBlue">
								Notes & Tips
							</h2>
							<Card className="border-sailorBlue/40 bg-gray-100/40">
								<CardContent className="p-4">
									<ul className="list-disc space-y-2">
										{notes.map((note, index) => (
											<li
												key={index}
												className="flex items-start text-sm text-sailorBlue"
											>
												{note.length > 0 && (
													<AlertCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-sailorBlue" />
												)}
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
							<h2 className="text-xl font-semibold text-sailorBlue">Syntax</h2>
							<CodeBlock initialCode={syntax} />
						</section>

						<section className="space-y-2">
							<h2 className="text-xl font-semibold text-sailorBlue">Example</h2>
							<CodeBlock initialCode={example.code} />
							<p className="mt-2 text-base text-sailorBlue">
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
