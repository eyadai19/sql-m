import { Card } from "@/components/ui/card";
import { Post } from "@/lib/types/post";
import { formatDistance } from "date-fns";
import { Heart, MessageSquare } from "lucide-react";

interface PostsViewProps {
	posts: Post[];
}

export function PostsView({ posts }: PostsViewProps) {
	return (
		<div className="grid gap-6">
			{posts.map((post) => (
				<Card key={post.id} className="overflow-hidden">
					<div className="p-4">
						<div className="mb-4 flex items-center gap-3">
							<div className="h-10 w-10 overflow-hidden rounded-full">
								<img
									src={post.user.photo || "https://via.placeholder.com/40"}
									alt={post.user.name}
									className="h-full w-full object-cover"
								/>
							</div>
							<div>
								<p className="font-medium">{`${post.user.name}`}</p>
								<p className="text-sm text-gray-500">
									{formatDistance(new Date(post.createdTime), new Date(), {
										addSuffix: true,
									})}
								</p>
							</div>
						</div>

						<h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
						<p className="mb-4 text-gray-600">{post.content}</p>

						{post.photo && (
							<img
								src={post.photo}
								alt={post.title}
								className="mb-4 h-64 w-full rounded-lg object-cover"
							/>
						)}

						<div className="flex items-center justify-between text-gray-500">
							<div className="flex items-center gap-2">
								<Heart className="h-5 w-5" />
								<span>{post.likesCount}</span>
							</div>
							<div className="flex items-center gap-2">
								<MessageSquare className="h-5 w-5" />
								<span>{post.comments.length}</span>
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
