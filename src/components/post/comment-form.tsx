"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  userAvatar: string;
}

export function CommentForm({ onSubmit, userAvatar }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-start">
      <Avatar className="w-8 h-8">
        <AvatarImage src={userAvatar} alt="Your avatar" />
        <AvatarFallback>YA</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[80px] resize-none"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          disabled={!content.trim() || isSubmitting}
          className="ml-auto"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}