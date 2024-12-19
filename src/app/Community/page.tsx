import CommunityPage from "@/components/Community";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_comment_likes, TB_post_likes } from "@/lib/schema";
import { nanoid } from "nanoid";
import { logoutAction } from "../Profile/page";

export default function Community() {
	return (
		<div>
			<ProfileNavbar logoutAction={logoutAction} />
			<CommunityPage fetchAllPostsAction={fetchAllPostsAction} />
		</div>
	);
}

interface User {
	id: string;
	name: string;
}

interface Comment {
	id: string;
	content: string;
	createdTime: Date;
	user: User;
}

export interface Post {
	id: string;
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
			content: post.content,
			photo: post.photo,
			createdTime: post.createdTime,
			lastUpdateTime: post.lastUpdateTime,
			user: {
				id: post.user.id,
				name: post.user.firstName + " " + post.user.lastName,
			},
			comments: post.comments.map((comment) => ({
				id: comment.id,
				content: comment.content,
				createdTime: comment.createdTime,
				user: {
					id: comment.user.id,
					name: comment.user.firstName + " " + comment.user.lastName,
				},
			})),
			likesCount: post.likes.length, // عد الإعجابات
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
	"use server";
	try {
		const user = await getUser();
		if (!user) return;
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
