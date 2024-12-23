"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function CommentForm({
	userPhoto,
	postId,
	postCommentAction,
}: {
	userPhoto: string | null;
	postId: string;
	postCommentAction: (
		postId: string,
		content: string,
		photo: string | null,
	) => Promise<{ field: string; message: string } | undefined>;
}) {
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) {
			console.log("Comment cannot be empty.");
			return;
		}
		setIsSubmitting(true);
		try {
			const result = await postCommentAction(postId, content, userPhoto);
			if (result) {
				console.log(result.message);
				console.error("Error posting comment:", result.message);
			} else {
				console.log("Comment posted successfully!");
				setContent("");
			}
		} catch (error) {
			console.error("Unexpected error while posting comment:", error);
			console.log("An unexpected error occurred, please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};


	return (
		<form onSubmit={handleSubmit} className="flex items-start gap-4">
			<Avatar className="h-8 w-8">
				{userPhoto && (
					<div>
						<AvatarImage src={userPhoto} alt="Your avatar" />
					</div>
				)}
				<AvatarFallback>YA</AvatarFallback>
			</Avatar>
			<div className="flex-1 space-y-2">
				<Textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Write a comment..."
					className="min-h-[80px] resize-none"
					disabled={isSubmitting}
				/>
				<Button
					type="submit"
					disabled={!content.trim() || isSubmitting}
					className="ml-auto"
				>
					{isSubmitting ? "Posting..." : "Post Comment"}
				</Button>
			</div>
		</form>
	);
}
