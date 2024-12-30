"use client";
import { Card } from "@/components/ui/card";
import { Post } from "@/lib/types/post";
import { useState } from "react";
import { CommentForm } from "./comment/comment-form";
import { CommentList } from "./comment/comment-list";
import { PostActions } from "./PostActions";
import { PostContent } from "./PostContent";
import { PostHeader } from "./PostHeader";

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
	) => Promise<
		| {
				field: string;
				message: string;
		  }
		| undefined
	>;
	postCommentLikeAction: (commentId: string) => Promise<
		| {
				field: string;
				message: string;
		  }
		| undefined
	>;
}) {
	const [isLiking, setIsLiking] = useState(false);
	const [likesCount, setLikesCount] = useState(post.likesCount);
	const [isLiked, setIsLiked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

	const handleLike = async () => {
		if (isLiking) return;
		setIsLiking(true);

		try {
			const result = await postLikeAction(post.id);
			if (result) {
				console.error("Error liking post:", result.message);
				setFeedbackMessage(result.message);
			} else {
				setIsLiked(!isLiked);
				setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
				setFeedbackMessage(
					isLiked ? "Like removed" : "Post liked successfully",
				);
			}
		} catch (error) {
			console.error("Unexpected error while liking post:", error);
			setFeedbackMessage("An error occurred. Please try again.");
		} finally {
			setIsLiking(false);
			setTimeout(() => setFeedbackMessage(null), 3000);
		}
	};

	const handleEdit = () => {
		// Implement edit functionality
		console.log("Edit post:", post.id);
	};

	const handleDelete = () => {
		// Implement delete functionality
		console.log("Delete post:", post.id);
	};

	return (
		<Card className="mx-auto max-w-2xl overflow-hidden">
			<div className="p-4 sm:p-6">
				<PostHeader
					userPhoto={post.user.photo}
					userName={post.user.name}
					createdTime={post.createdTime}
					canEdit={true} // Add logic to determine if user can edit
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>

				<PostContent
					title={post.title}
					content={post.content}
					photo={post.photo}
				/>

				<PostActions
					isLiked={isLiked}
					isLiking={isLiking}
					likesCount={likesCount}
					commentsCount={post.comments.length}
					onLike={handleLike}
					onToggleComments={() => setShowComments(!showComments)}
				/>

				{feedbackMessage && (
					<div className="mt-4 text-center text-sm text-muted-foreground">
						{feedbackMessage}
					</div>
				)}
			</div>

			{showComments && (
				<div className="space-y-6 border-t bg-muted/10 p-4 sm:p-6">
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
