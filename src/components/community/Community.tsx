"use client";

import { Post } from "@/lib/types/post";
import { useEffect, useState } from "react";
import PostCard from "../post/post-card";
import { CreatePostButton } from "./CreatePostButton";
import { PostFilters } from "./PostFilters";
import { WelcomeBanner } from "./WelcomeBanner";

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
		photo: string | null,
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
			<div className="flex h-screen items-center justify-center">
				<div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-[#ADF0D1]"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
			<div className="mx-auto max-w-4xl">
				<WelcomeBanner />

				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-2xl font-bold text-gray-900">Community Posts</h2>
					<CreatePostButton />
				</div>

				<div className="space-y-6">
					<PostFilters />

					<div className="divide-y divide-gray-200 rounded-lg bg-white shadow">
						{posts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								postLikeAction={postLikeAction}
								postCommentAction={postCommentAction}
								postCommentLikeAction={postCommentLikeAction}
							/>
						))}

						{/* Placeholder for empty state */}
						{posts.length === 0 && (
							<div className="flex flex-col items-center justify-center py-12">
								<p className="text-lg font-medium text-gray-900">
									No posts yet
								</p>
								<p className="mt-1 text-sm text-gray-500">
									Be the first to share something with the community!
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
