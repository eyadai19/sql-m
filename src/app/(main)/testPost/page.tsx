
'use client'

import { PostCard } from "@/components/post/post-card";

// Mock data for demonstration
const mockPost = {
  id: "1",
  title: "Exploring the Future of Web Development",
  content: "Today, we're diving deep into the latest trends in web development. From new frameworks to innovative approaches, there's so much to discover!",
  author: {
    id: "author1",
    name: "John Smith",
    avatar: "https://unsplash.com/photos/a-man-with-a-goatee-and-a-turtle-neck-sweater-1lgtuDNtIAY",
  },
  timestamp: new Date().toISOString(),
  image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=675&fit=crop",
};

const mockComments = [
  {
    id: "c1",
    content: "Great insights! Looking forward to more content like this.",
    author: {
      id: "user1",
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
    },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

const mockLikes = {
  count: 42,
  isLiked: false,
};

export default function Home() {
  const handleLike = async (postId: string) => {
    console.log("Like post:", postId);
  };

  const handleComment = async (postId: string, content: string) => {
    console.log("New comment on post:", postId, content);
  };

  const handleShare = async (postId: string) => {
    console.log("Share post:", postId);
  };

  return (
    <main className="min-h-screen  py-12 px-4">
      <PostCard
        post={mockPost}
        comments={mockComments}
        likes={mockLikes}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
      />
    </main>
  );
}