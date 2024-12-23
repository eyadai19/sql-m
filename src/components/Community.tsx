"use client";

import { Post } from "@/app/Community/page";
import { useEffect, useState } from "react";
import PostCard from "./post/post-card";

export default function CommunityPage({
	fetchAllPostsAction,
	postCommentAction,
	postLikeAction,
	postCommentLikeAction,
}: {
	fetchAllPostsAction: () => Promise<
		Post[] | { field: string; message: string }
	>;
	postCommentAction: (
		postId: string,
		content: string,
		photo: string,
	) => Promise<{ field: string; message: string } | undefined>;
	postLikeAction: (
		postId: string,
	) => Promise<{ field: string; message: string } | undefined>;
	postCommentLikeAction: (
		commentId: string,
	) => Promise<{ field: string; message: string } | undefined>;
}) {
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetchAllPostsAction();
			if (!Array.isArray(result)) {
				setError("Error loading posts");
			} else {
				setPosts(result);
			}
		};
		fetchData();
	}, [fetchAllPostsAction]);

	if (error) {
		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold text-red-600">{error}</h1>
			</div>
		);
	}

	if (!posts) {
		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold">Loading...</h1>
			</div>
		);
	}

	return (
		<div
			className="flex min-h-screen items-center justify-center px-8"
			style={{
				background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
			}}
		>
			{" "}
			<h1 className="mb-6 text-center text-3xl font-extrabold text-blue-600">
				Community Posts
			</h1>
			<div className="space-y-6">
				{posts.map((post) => (
					// <div
					// 	key={post.id}
					// 	className="rounded-lg border bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
					// >
					// 	<div className="mb-4 flex items-center justify-between">
					// 		<h2 className="text-xl font-semibold text-gray-800">
					// 			{post.user.name}
					// 		</h2>
					// 		<span className="text-sm text-gray-500">
					// 			{new Date(post.createdTime).toLocaleDateString()}
					// 		</span>
					// 	</div>
					// 	<p className="mb-4 text-lg text-gray-700">{post.content}</p>
					// 	{post.photo && (
					// 		<img
					// 			src={post.photo}
					// 			alt="Post photo"
					// 			className="mb-4 h-48 w-full rounded-lg object-cover"
					// 		/>
					// 	)}
					// 	<div className="flex items-center justify-between text-sm text-gray-500">
					// 		<div className="flex items-center space-x-2">
					// 			<span className="flex items-center">
					// 				<FaThumbsUp className="mr-1 text-blue-500" />
					// 				{post.likesCount}
					// 			</span>
					// 			<span className="flex items-center">
					// 				<FaCommentAlt className="mr-1 text-gray-500" />
					// 				{post.comments.length}
					// 			</span>
					// 		</div>
					// 		<button className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white shadow-md hover:bg-blue-600">
					// 			Like
					// 		</button>
					// 	</div>
					// 	{post.comments.length > 0 && (
					// 		<div className="mt-4 border-t pt-4">
					// 			<h3 className="font-medium text-gray-800">Comments:</h3>
					// 			<ul className="mt-2 space-y-3">
					// 				{post.comments.map((comment) => (
					// 					<li key={comment.id} className="text-gray-600">
					// 						<strong className="text-gray-800">
					// 							{comment.user.name}:
					// 						</strong>{" "}
					// 						{comment.content}
					// 					</li>
					// 				))}
					// 			</ul>
					// 		</div>
					// 	)}
					// </div>
					<PostCard
						post={post}
						postLikeAction={postLikeAction}
						postCommentAction={postCommentAction}
						postCommentLikeAction={postCommentLikeAction}
					/>
				))}
			</div>
		</div>
	);
}
