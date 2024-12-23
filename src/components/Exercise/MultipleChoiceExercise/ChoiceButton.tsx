"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Choice } from "@/lib/types/exerciseTypes";

interface ChoiceButtonProps {
  choice: Choice;
  isSelected: boolean;
  onClick: () => void;
}

export default function ChoiceButton({ choice, isSelected, onClick }: ChoiceButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={isSelected ? "default" : "outline"}
      className="h-auto p-4 flex flex-col items-center justify-center w-full"
    >
      {choice.imageUrl && (
        <div className="relative w-full h-32 mb-2">
          <Image
            src={choice.imageUrl}
            alt="Choice illustration"
            fill
            className="object-contain rounded-lg"
          />
        </div>
      )}
      <span className="text-center">{choice.text}</span>
    </Button>
  );
}