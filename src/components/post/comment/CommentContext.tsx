"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Comment, Post } from "@/lib/types/post";

type CommentContextType = {
	comments: Comment[];
	addComment: (newComment: Comment) => void;
};

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const useCommentContext = () => {
	const context = useContext(CommentContext);
	if (!context) {
		throw new Error("useCommentContext must be used within a CommentProvider");
	}
	return context;
};

export const CommentProvider = ({
	children,
	initialComments,
}: {
	children: ReactNode;
	initialComments: Comment[];
}) => {
	const [comments, setComments] = useState<Comment[]>(initialComments);

	const addComment = (newComment: Comment) => {
		setComments((prevComments) => [newComment, ...prevComments]);
	};

	return (
		<CommentContext.Provider value={{ comments, addComment }}>
			{children}
		</CommentContext.Provider>
	);
};