import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Post } from "@/lib/types/post";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
	Heart,
	MessageCircle,
	MoreVertical,
	Pencil,
	Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { CommentForm } from "./comment/comment-form";
import { CommentList } from "./comment/comment-list";

export default function PostCard({
	post: initialPost,
	postLikeAction,
	postCommentAction,
	postCommentLikeAction,
	editPostAction,
	deletePostAction,
	useImage,
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
	editPostAction: (
		postId: string,
		title: string | null,
		content: string | null,
	) => Promise<{ field: string; message: string } | undefined>;
	deletePostAction: (
		postId: string,
	) => Promise<{ field: string; message: string } | undefined>;
	useImage: string | null;
}) {
	const [post, setPost] = useState(initialPost);
	const [isLiking, setIsLiking] = useState(false);
	const [likesCount, setLikesCount] = useState(post.likesCount);
	const [isLiked, setIsLiked] = useState(initialPost.isLiked);
	const [showComments, setShowComments] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(post.title);
	const [editContent, setEditContent] = useState(post.content);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		setPost(initialPost);
	}, [initialPost]);

	// Reset edit form when dialog opens
	useEffect(() => {
		if (isEditing) {
			setEditTitle(post.title);
			setEditContent(post.content);
		}
	}, [isEditing, post]);

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

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			const error = await deletePostAction(post.id);
			if (error) {
				alert(`Failed to delete post: ${error.message}`);
			}
		} catch (err) {
			console.error("Error deleting post:", err);
			alert("An unexpected error occurred.");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleEdit = async () => {
		try {
			setIsSaving(true);
			const error = await editPostAction(
				post.id,
				editTitle !== post.title ? editTitle : null,
				editContent !== post.content ? editContent : null,
			);

			if (error) {
				alert(`Failed to edit post: ${error.message}`);
			} else {
				// Update local state with new values
				setPost((prev) => ({
					...prev,
					title: editTitle,
					content: editContent,
				}));
				setIsEditing(false);
			}
		} catch (err) {
			alert("An unexpected error occurred.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Reset form values
		setEditTitle(post.title);
		setEditContent(post.content);
	};

	return (
		<Card className="mx-auto my-3 max-w-4xl overflow-hidden">
			<div className="p-4 sm:p-6">
				<div className="mb-4 flex items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<Avatar className="h-12 w-12">
							{post.user.photo && (
								<AvatarImage src={post.user.photo} alt={post.user.name} />
							)}
							<AvatarFallback>
								{post.user.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<h2 className="font-semibold">{post.user.name}</h2>
							<p className="text-sm text-muted-foreground">
								{formatDistanceToNow(post.createdTime, { addSuffix: true })}
							</p>
						</div>
					</div>

					{post.canEdit && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<MoreVertical className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => setIsEditing(true)}>
									<Pencil className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleDelete}
									className="text-red-600"
									disabled={isDeleting}
								>
									{isDeleting ? (
										<span className="animate-spin">⏳</span>
									) : (
										<>
											<Trash className="mr-2 h-4 w-4" />
											Delete
										</>
									)}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					<Dialog open={isEditing} onOpenChange={setIsEditing}>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Edit Post</DialogTitle>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Title</label>
									<Input
										value={editTitle}
										onChange={(e) => setEditTitle(e.target.value)}
										placeholder="Post title"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Content</label>
									<Textarea
										value={editContent}
										onChange={(e) => setEditContent(e.target.value)}
										placeholder="Post content"
										rows={4}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button variant="outline" onClick={handleCancel}>
									Cancel
								</Button>
								<Button onClick={handleEdit} disabled={isSaving}>
									{isSaving ? "Saving..." : "Save changes"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>

				<div className="space-y-4">
					<h3 className="text-xl font-semibold">{post.title}</h3>
					<p className="whitespace-pre-wrap text-base">{post.content}</p>
					{post.photo && (
						<div className="relative aspect-video overflow-hidden rounded-lg">
							<img
								src={post.photo}
								alt="Post image"
								className="h-full w-full object-cover"
							/>
						</div>
					)}
				</div>

				<div className="mt-6 flex flex-wrap items-center gap-4">
					<Button
						variant="ghost"
						size="sm"
						className={cn("flex items-center gap-2", isLiked && "text-red-500")}
						onClick={handleLike}
						disabled={isLiking}
					>
						<Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
						<span>{likesCount}</span>
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
				</div>

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
						userPhoto={useImage}
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
