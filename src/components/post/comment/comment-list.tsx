"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Comment } from "@/lib/types/post";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";
import { useState } from "react";

export function CommentList({
	comments,
	postCommentLikeAction,
}: {
	comments: Comment[];
	postCommentLikeAction: (
		commentId: string,
	) => Promise<{ field: string; message: string } | undefined>;
}) {
	const [isLiking, setIsLiking] = useState<{ [key: string]: boolean }>({});
	const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>(
		comments.reduce(
			(acc, comment) => {
				acc[comment.id] = comment.likes || 0;
				return acc;
			},
			{} as { [key: string]: number },
		),
	);
	const [likedComments, setLikedComments] = useState<{
		[key: string]: boolean;
	}>(
		comments.reduce(
			(acc, comment) => {
				acc[comment.id] = comment.isLiked || false; // تعيين isLiked بناءً على comment.isLiked
				return acc;
			},
			{} as { [key: string]: boolean },
		),
	);

	const handleLike = async (commentId: string) => {
		if (isLiking[commentId]) return;

		setIsLiking((prev) => ({ ...prev, [commentId]: true }));
		try {
			const result = await postCommentLikeAction(commentId);
			if (!result) {
				// تحديث الحالة المحلية
				setLikedComments((prev) => ({
					...prev,
					[commentId]: !prev[commentId],
				}));
				setLikeCounts((prev) => ({
					...prev,
					[commentId]: prev[commentId] + (likedComments[commentId] ? -1 : 1),
				}));
			} else {
				console.error("Error liking comment:", result.message);
			}
		} catch (error) {
			console.error("Unexpected error while liking comment:", error);
		} finally {
			setIsLiking((prev) => ({ ...prev, [commentId]: false }));
		}
	};

	return (
		<div>
			{!comments.length ? (
				<div className="py-8 text-center text-muted-foreground">
					No comments yet. Be the first to comment!
				</div>
			) : (
				<div className="space-y-6">
					{comments.map((comment) => (
						<div key={comment.id} className="flex gap-4">
							<Avatar className="h-8 w-8">
								{comment.user.photo && (
									<div>
										<AvatarImage
											src={comment.user.photo}
											alt={comment.user.name}
										/>
									</div>
								)}
								<AvatarFallback>
									{comment.user.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="rounded-lg bg-muted p-4">
									<div className="mb-2 flex items-center justify-between">
										<span className="font-medium">{comment.user.name}</span>
										<span className="text-sm text-muted-foreground">
											{formatDistanceToNow(new Date(comment.createdTime), {
												addSuffix: true,
											})}
										</span>
									</div>
									<p className="text-sm">{comment.content}</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										"flex items-center gap-2",
										likedComments[comment.id] && "text-red-500",
									)}
									onClick={() => handleLike(comment.id)}
									disabled={isLiking[comment.id]}
								>
									<Heart
										className={cn(
											"h-5 w-5",
											likedComments[comment.id] && "fill-current",
										)}
									/>
									<span>{likeCounts[comment.id]}</span>
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
