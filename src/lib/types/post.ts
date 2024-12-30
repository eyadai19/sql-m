interface User {
	id: string;
	name: string;
	photo: string | null;
}

export interface Comment {
	id: string;
	content: string;
	createdTime: Date;
	user: User;
}

export interface Post {
	id: string;
	title: string;
	content: string;
	photo: string | null;
	createdTime: Date;
	lastUpdateTime: Date;
	user: User;
	comments: Comment[];
	likesCount: number;
}
