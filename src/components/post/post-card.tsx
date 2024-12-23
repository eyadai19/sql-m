"use client";

import { Post } from "@/app/Community/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";

export default function PostCard({
	post,
	postLikeAction,
	postCommentAction,
	postCommentLikeAction,
}: {
	post: Post;
	postLikeAction: (
		postId: string,
	) => Promise<{ field: string; message: string } | undefined>;
	postCommentAction: (
		postId: string,
		content: string,
		photo: string | null,
	) => Promise<{ field: string; message: string } | undefined>;
	postCommentLikeAction: (
		commentId: string,
	) => Promise<{ field: string; message: string } | undefined>;
}) {
	const [isLiking, setIsLiking] = useState(false);
	const [showComments, setShowComments] = useState(false);

	const handleLike = async () => {
		if (isLiking) return;
		{
			setIsLiking(true);
			try {
				const result = await postLikeAction(post.id);
				if (result) {
					console.error("Error liking post:", result.message);
					// Optionally handle UI feedback based on the specific field/message.
				}
			} catch (error) {
				console.error("Unexpected error while liking post:", error);
			} finally {
				setIsLiking(false);
			}
		}
	};

	// const handleCommentLike = async () => {
	// 	await postCommentLikeAction(post.id);
	// };

	return (
		<Card className="mx-auto max-w-2xl">
			<div className="p-6">
				{/* Header */}
				<div className="mb-4 flex items-center gap-4">
					<Avatar className="h-12 w-12">
						{post.user.photo && (
							<div>
								<AvatarImage src={post.user.photo} alt={post.user.name} />,
							</div>
						)}
						<AvatarFallback>
							{post.user.name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="font-semibold">{post.user.name}</h2>
						<p className="text-sm text-muted-foreground">
							{formatDistanceToNow(new Date(post.createdTime), {
								addSuffix: true,
							})}
						</p>
					</div>
				</div>

				{/* Content */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold">{post.title}</h3>
					<p className="text-base">{post.content}</p>
					{post.photo && (
						<div className="relative aspect-video overflow-hidden rounded-lg">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={post.photo}
								alt="Post image"
								className="h-full w-full object-cover"
							/>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="mt-6 flex items-center gap-6">
					<Button
						variant="ghost"
						size="sm"
						className={cn(
							"flex items-center gap-2",
							post.likesCount != 0 && "text-red-500",
						)}
						onClick={handleLike}
						disabled={isLiking}
					>
						<Heart
							className={cn("h-5 w-5", post.likesCount != 0 && "fill-current")}
						/>
						<span>{post.likesCount}</span>
					</Button>

					<Button
						variant="ghost"
						size="sm"
						className="flex items-center gap-2"
						onClick={() => setShowComments(!showComments)}
					>
						<MessageCircle className="h-5 w-5" />
						<span>{post.comments.length}</span>
					</Button>

					{/* {onShare && (
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center gap-2"
							onClick={() => onShare(post.id)}
						>
							<Share className="h-5 w-5" />
							<span>Share</span>
						</Button>
					)} */}
				</div>
			</div>

			{/* Comments Section */}
			{showComments && (
				<div className="space-y-6 border-t p-6">
					<CommentForm
						postCommentAction={postCommentAction}
						postId={post.id}
						userPhoto={post.user.photo}
					/>
					<CommentList
						comments={post.comments}
						postCommentLikeAction={postCommentLikeAction}
					/>
				</div>
			)}
		</Card>
	);
}
