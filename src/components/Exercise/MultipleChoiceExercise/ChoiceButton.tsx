"use client";

import { Button } from "@/components/ui/button";
import { Choice } from "@/lib/types/exerciseTypes";
import Image from "next/image";

interface ChoiceButtonProps {
	choice: Choice;
	isSelected: boolean;
	onClick: () => void;
}

export default function ChoiceButton({
	choice,
	isSelected,
	onClick,
}: ChoiceButtonProps) {
	return (
		<Button
			onClick={onClick}
			variant={isSelected ? "default" : "outline"}
			className={`flex h-auto w-full flex-col items-center justify-center p-2 ${!isSelected ? "bg-white/30" : ""}`}
		>
			{choice.imageUrl && (
				<div className="relative mb-2 h-32 w-full">
					<Image
						src={choice.imageUrl}
						alt="Choice illustration"
						fill
						className="rounded-lg object-contain"
					/>
				</div>
			)}
			<span className="text-center">{choice.text}</span>
		</Button>
	);
}
