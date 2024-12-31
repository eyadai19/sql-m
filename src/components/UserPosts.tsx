// "use client";

// import { userPostAction } from "@/app/actions/postsAction";
// import { Post } from "@/lib/types/post";
// import { useEffect, useState } from "react";
// import { PostsView } from "./PostsView";

// export function UserPosts() {
// 	const [posts, setPosts] = useState<Post[]>([]);
// 	const [error, setError] = useState<string | null>(null);

// 	useEffect(() => {
// 		const fetchPosts = async () => {
// 			const result = await userPostAction();

// 			if ("field" in result) {
// 				setError(result.message);
// 			} else {
// 				setPosts(result);
// 			}
// 		};

// 		fetchPosts();
// 	}, []);

// 	if (error) {
// 		return <div className="p-6 text-center text-red-500">{error}</div>;
// 	}

// 	return <PostsView posts={posts} />;
// }
