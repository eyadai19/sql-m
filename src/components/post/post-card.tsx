"use client";

import { useState } from "react";
import { PostProps } from "@/lib/types/post";
import { Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CommentList } from "./comment-list";
import { CommentForm } from "./comment-form";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share } from "lucide-react";
import { cn } from "@/lib/utils";

export function PostCard({
  post,
  comments,
  likes,
  onLike,
  onComment,
  onShare,
}: PostProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (content: string) => {
    await onComment(post.id, content);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{post.author.name}</h2>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{post.title}</h3>
          <p className="text-base">{post.content}</p>
          {post.image && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt="Post image"
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 mt-6">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-2",
              likes.isLiked && "text-red-500"
            )}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart
              className={cn(
                "w-5 h-5",
                likes.isLiked && "fill-current"
              )}
            />
            <span>{likes.count}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{comments.length}</span>
          </Button>

          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => onShare(post.id)}
            >
              <Share className="w-5 h-5" />
              <span>Share</span>
            </Button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t p-6 space-y-6">
          <CommentForm
            onSubmit={handleComment}
            userAvatar={post.author.avatar} // In a real app, this would be the current user's avatar
          />
          <CommentList comments={comments} />
        </div>
      )}
    </Card>
  );
}