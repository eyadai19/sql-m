"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle } from "lucide-react";

interface PostActionsProps {
	isLiked: boolean;
	isLiking: boolean;
	likesCount: number;
	commentsCount: number;
	onLike: () => void;
	onToggleComments: () => void;
}

export function PostActions({
	isLiked,
	isLiking,
	likesCount,
	commentsCount,
	onLike,
	onToggleComments,
}: PostActionsProps) {
	return (
		<div className="mt-6 flex flex-wrap items-center gap-4">
			<Button
				variant="ghost"
				size="sm"
				className={cn("flex items-center gap-2", isLiked && "text-red-500")}
				onClick={onLike}
				disabled={isLiking}
			>
				<Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
				<span>{likesCount}</span>
			</Button>

			<Button
				variant="ghost"
				size="sm"
				className="flex items-center gap-2"
				onClick={onToggleComments}
			>
				<MessageCircle className="h-5 w-5" />
				<span>{commentsCount}</span>
			</Button>
		</div>
	);
}
