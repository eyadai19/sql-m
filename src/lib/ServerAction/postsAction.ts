"use server";

import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	TB_comment_likes,
	TB_comments,
	TB_post_likes,
	TB_posts,
} from "@/lib/schema";
import { Post } from "@/lib/types/post";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function fetchAllPostsAction(): Promise<
	Post[] | { field: string; message: string }
> {
	try {
		const posts = await db.query.TB_posts.findMany({
			with: {
				user: true,
				comments: {
					with: {
						user: true,
						likes: true,
					},
				},
				likes: true,
			},
		});
		const user = await getUser();
		if (!user) return { field: "root", message: "error" };
		const userCommentLikes = await db.query.TB_comment_likes.findMany({
			where: (comment, { eq }) => eq(comment.userId, user.id),
		});

		return posts.map((post) => ({
			id: post.id,
			title: post.title,
			content: post.content,
			photo: post.photo,
			createdTime: post.createdTime,
			lastUpdateTime: post.lastUpdateTime,
			user: {
				id: post.user.id,
				name: post.user.firstName + " " + post.user.lastName,
				photo: post.user.photo,
			},
			comments: post.comments.map((comment) => ({
				id: comment.id,
				content: comment.content,
				createdTime: comment.createdTime,
				user: {
					id: comment.user.id,
					name: comment.user.firstName + " " + comment.user.lastName,
					photo: comment.user.photo,
				},
				likes: comment.likes.length,
				isLiked: userCommentLikes.some((like) => like.commentId === comment.id),
			})),
			likesCount: post.likes.length,
			canEdit: post.userId == user.id ? true : false,
		}));
	} catch (error) {
		console.error("Error fetching posts:", error);
		return { field: "root", message: "error" };
	}
}

export async function postLikeAction(
	postId: string,
): Promise<{ field: string; message: string } | undefined> {
	try {
		const user = await getUser();
		if (!user) return;

		const existingLike = await db.query.TB_post_likes.findFirst({
			where: (like, { eq }) =>
				eq(like.postId, postId) && eq(like.userId, user.id),
		});

		if (existingLike) {
			try {
				await db
					.delete(TB_post_likes)
					.where(eq(TB_post_likes.id, existingLike.id));
				return { field: "postId", message: "Like removed successfully" };
			} catch {
				return { field: "root", message: "Failed to remove like" };
			}
		}

		const newLike = {
			id: nanoid(),
			userId: user.id,
			postId: postId,
			createdTime: new Date(),
		};

		try {
			await db.insert(TB_post_likes).values(newLike);
		} catch {
			return { field: "username", message: "can't like" };
		}
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}

export async function postCommentLikeAction(
	commentId: string,
): Promise<{ field: string; message: string } | undefined> {
	try {
		const user = await getUser();
		if (!user) return;

		const existingLike = await db.query.TB_comment_likes.findFirst({
			where: (comment, { eq }) =>
				eq(comment.userId, user.id) && eq(comment.commentId, commentId),
		});
		if (existingLike) {
			try {
				await db
					.delete(TB_comment_likes)
					.where(eq(TB_comment_likes.id, existingLike.id));
				return {
					field: "commentId",
					message: "Comment like removed successfully",
				};
			} catch {
				return { field: "root", message: "Failed to remove comment like" };
			}
		}

		const newCommentLike = {
			id: nanoid(),
			userId: user.id,
			createdTime: new Date(),
			commentId: commentId,
		};
		try {
			await db.insert(TB_comment_likes).values(newCommentLike);
		} catch {
			return { field: "username", message: "can't comment like" };
		}
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}

export async function postCommentAction(
	postId: string,
	content: string,
	photo: string | null,
): Promise<{ field: string; message: string } | undefined> {
	try {
		const user = await getUser();
		if (!user) return;

		const newComment = {
			id: nanoid(),
			userId: user.id,
			postId: postId,
			createdTime: new Date(),
			content: content,
			photo: photo,
		};

		try {
			await db.insert(TB_comments).values(newComment);
		} catch {
			return { field: "username", message: "can't comment" };
		}
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}

export async function editPostAction(
	postId: string,
	title: string | null,
	content: string | null,
): Promise<{ field: string; message: string } | undefined> {
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated" };

		const existingPost = await db.query.TB_posts.findFirst({
			where: (post, { eq }) => eq(post.id, postId) && eq(post.userId, user.id),
		});

		if (!existingPost) {
			return {
				field: "postId",
				message: "Post not found or not owned by user",
			};
		}

		const updatedPost = {
			title: title || existingPost.title,
			content: content || existingPost.content,
			lastUpdateTime: new Date(),
		};

		try {
			await db.update(TB_posts).set(updatedPost).where(eq(TB_posts.id, postId));
			return undefined; // Success case
		} catch (e) {
			console.error("Error updating post:", e);
			return { field: "root", message: "Failed to update post" };
		}
	} catch (error) {
		console.error("Unexpected error:", error);
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}

export async function userPostAction(): Promise<
	Post[] | { field: string; message: string }
> {
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "error" };

		const posts = await db.query.TB_posts.findMany({
			where: (post, { eq }) => eq(post.userId, user.id),
			with: {
				user: true,
				comments: {
					with: {
						user: true,
						likes: true,
					},
				},
				likes: true,
			},
		});
		const userCommentLikes = await db.query.TB_comment_likes.findMany({
			where: (comment, { eq }) => eq(comment.userId, user.id),
		});

		return posts.map((post) => ({
			id: post.id,
			title: post.title,
			content: post.content,
			photo: post.photo,
			createdTime: post.createdTime,
			lastUpdateTime: post.lastUpdateTime,
			user: {
				id: post.user.id,
				name: post.user.firstName + " " + post.user.lastName,
				photo: post.user.photo,
			},
			comments: post.comments.map((comment) => ({
				id: comment.id,
				content: comment.content,
				createdTime: comment.createdTime,
				user: {
					id: comment.user.id,
					name: comment.user.firstName + " " + comment.user.lastName,
					photo: post.user.photo,
				},
				likes: comment.likes.length,
				isLiked: userCommentLikes.some((like) => like.commentId === comment.id),
			})),
			likesCount: post.likes.length,
			canEdit: true,
		}));
	} catch (error) {
		console.error("Error fetching posts:", error);
		return { field: "root", message: "error" };
	}
}

export async function addPostAction(
	title: string,
	content: string,
	photo: string | null,
): Promise<{ field: string; message: string } | undefined> {
	"use server";

	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated" };

		const newPost = {
			id: nanoid(),
			userId: user.id,
			title: title,
			content: content,
			photo: photo,
			createdTime: new Date(),
			lastUpdateTime: new Date(),
		};

		try {
			await db.insert(TB_posts).values(newPost);
			return { field: "root", message: "Post added successfully" };
		} catch (error) {
			console.error("Error inserting post:", error);
			return { field: "root", message: "Failed to add post" };
		}
	} catch (error) {
		console.error("Unexpected error:", error);
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}

export async function deletePostAction(
	postId: string,
): Promise<{ field: string; message: string } | undefined> {
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated" };

		const existingPost = await db.query.TB_posts.findFirst({
			where: (post, { eq }) => eq(post.id, postId) && eq(post.userId, user.id),
		});

		if (!existingPost) {
			return {
				field: "postId",
				message: "Post not found or not owned by user",
			};
		}

		try {
			await db.delete(TB_posts).where(eq(TB_posts.id, postId));
			return { field: "root", message: "Post deleted successfully" };
		} catch (error) {
			console.error("Error deleting post:", error);
			return { field: "root", message: "Failed to delete post" };
		}
	} catch (error) {
		console.error("Unexpected error:", error);
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}

export async function infoAddPostAction(): Promise<
	| { field: string; message: string }
	| undefined
	| { name: string; photo: string | null }
> {
	"use server";

	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated" };
		const userInfo = await db.query.TB_user.findFirst({
			where: (searchUser, { eq }) => eq(searchUser.id, user.id),
		});
		if (!userInfo) return { field: "root", message: "User not found" };

		return {
			name: userInfo.firstName + " " + userInfo.lastName,
			photo: userInfo.photo,
		};
	} catch (error) {
		console.error("Unexpected error:", error);
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}
