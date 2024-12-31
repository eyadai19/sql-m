"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { PenSquare } from "lucide-react";

export function CreatePostButton() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="gap-2 bg-[#00203F] hover:bg-[#00203F]/90">
					<PenSquare className="h-4 w-4" />
					Create Post
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a New Post</DialogTitle>
					<DialogDescription>
						Share your thoughts, questions, or insights with the community.
					</DialogDescription>
				</DialogHeader>
				{/* Post creation form will be added here later */}
				<div className="grid gap-4 py-4">
					<p className="text-sm text-muted-foreground">
						Post creation form coming soon...
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
