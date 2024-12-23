import CommunityPage from "@/components/Community";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_comment_likes, TB_comments, TB_post_likes } from "@/lib/schema";
import { nanoid } from "nanoid";
import { logoutAction } from "../Profile/page";

export default function Community() {
	return (
		<div>
			<ProfileNavbar logoutAction={logoutAction} />
			<CommunityPage
				fetchAllPostsAction={fetchAllPostsAction}
				postLikeAction={postLikeAction}
				postCommentAction={postCommentAction}
				postCommentLikeAction={postCommentLikeAction}
			/>
		</div>
	);
}

interface User {
	id: string;
	name: string;
	photo: string | null;
}

export interface Comment {
	id: string;
	content: string;
	createdTime: Date;
	user: User;
}

export interface Post {
	id: string;
	title: string;
	content: string;
	photo: string | null;
	createdTime: Date;
	lastUpdateTime: Date;
	user: User;
	comments: Comment[];
	likesCount: number;
}

export async function fetchAllPostsAction(): Promise<
	Post[] | { field: string; message: string }
> {
	"use server";
	try {
		const posts = await db.query.TB_posts.findMany({
			with: {
				user: true,
				comments: {
					with: {
						user: true,
					},
				},
				likes: true,
			},
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
			})),
			likesCount: post.likes.length,
		}));
	} catch (error) {
		console.error("Error fetching posts:", error);
		return { field: "root", message: "error" };
	}
}

export async function postLikeAction(
	postId: string,
): Promise<{ field: string; message: string } | undefined> {
	"use server";

	try {
		const user = await getUser();
		if (!user) return;

		const existingLike = await db.query.TB_post_likes.findFirst({
			where: (like, { eq }) =>
				eq(like.postId, postId) && eq(like.userId, user.id),
		});

		if (existingLike) {
			return { field: "postId", message: "You have already liked this post" };
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

export async function postCommentAction(
	postId: string,
	content: string,
	photo: string | null,
): Promise<{ field: string; message: string } | undefined> {
	"use server";

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

export async function postCommentLikeAction(
	commentId: string,
): Promise<{ field: string; message: string } | undefined> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return;

		const existingLike = await db.query.TB_comment_likes.findFirst({
			where: (comment, { eq }) =>
				eq(comment.userId, user.id) && eq(comment.commentId, commentId),
		});
		if (existingLike) {
			return {
				field: "commentId",
				message: "You have already liked this comment",
			};
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
