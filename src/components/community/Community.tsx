"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Post } from "@/lib/types/post";
import { useEffect, useState } from "react";
import PostCard from "../post/post-card";
import { CreatePostButton } from "./CreatePostButton";
import { WelcomeBanner } from "./WelcomeBanner";

export default function CommunityPage({
	fetchAllPostsAction,
	postCommentAction,
	postLikeAction,
	postCommentLikeAction,
	addPostAction,
	editPostAction,
	deletePostAction,
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
	addPostAction: (
		title: string,
		content: string,
		photo: string | null,
	) => Promise<{ field: string; message: string } | undefined>;
	editPostAction: (
		postId: string,
		title: string | null,
		content: string | null,
	) => Promise<{ field: string; message: string } | undefined>;
	deletePostAction: (
		postId: string,
	) => Promise<{ field: string; message: string } | undefined>;
}) {
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState<string>("all");
	const [sort, setSort] = useState<string>("latest");

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

	const filterAndSortPosts = (posts: Post[]) => {
		let filteredPosts = posts;
		if (filter === "today") {
			const today = new Date();
			filteredPosts = posts.filter(
				(post) =>
					new Date(post.createdTime).toDateString() === today.toDateString(),
			);
		} else if (filter === "thisWeek") {
			const today = new Date();
			const weekAgo = new Date(today.setDate(today.getDate() - 7));
			filteredPosts = posts.filter(
				(post) => new Date(post.createdTime) >= weekAgo,
			);
		} else if (filter === "thisMonth") {
			const today = new Date();
			const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
			filteredPosts = posts.filter(
				(post) => new Date(post.createdTime) >= monthStart,
			);
		}
		if (sort === "latest") {
			filteredPosts.sort(
				(a, b) =>
					new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime(),
			);
		} else if (sort === "popular") {
			filteredPosts.sort((a, b) => b.likesCount - a.likesCount);
		}
		return filteredPosts;
	};
	const displayedPosts = posts ? filterAndSortPosts(posts) : [];

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
					<CreatePostButton addPostAction={addPostAction} />
				</div>

				<div className="space-y-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setFilter("today")}
								className={filter === "today" ? "bg-gray-200" : ""}
							>
								Today
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setFilter("thisWeek")}
								className={filter === "thisWeek" ? "bg-gray-200" : ""}
							>
								This Week
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setFilter("thisMonth")}
								className={filter === "thisMonth" ? "bg-gray-200" : ""}
							>
								This Month
							</Button>
						</div>
						<Select
							defaultValue="latest"
							onValueChange={(value) => setSort(value)}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="latest">Latest Posts</SelectItem>
								<SelectItem value="popular">Most Liked</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="divide-y divide-gray-200 rounded-lg bg-white shadow">
						{displayedPosts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								postLikeAction={postLikeAction}
								postCommentAction={postCommentAction}
								postCommentLikeAction={postCommentLikeAction}
								deletePostAction={deletePostAction}
								editPostAction={editPostAction}
							/>
						))}

						{displayedPosts.length === 0 && (
							<div className="flex flex-col items-center justify-center py-12">
								<p className="text-lg font-medium text-gray-900">
									No posts found
								</p>
								<p className="mt-1 text-sm text-gray-500">
									Try a different filter or sort option.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
