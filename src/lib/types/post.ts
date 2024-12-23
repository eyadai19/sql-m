// export interface Author {
//     id: string;
//     name: string;
//     avatar: string;
//   }
  
//   export interface Comment {
//     id: string;
//     content: string;
//     author: Author;
//     timestamp: string;
//   }
  
//   export interface Post {
//     id: string;
//     title: string;
//     content: string;
//     author: Author;
//     timestamp: string;
//     image?: string;
//   }
  
//   export interface PostLikes {
//     count: number;
//     isLiked: boolean;
//   }
  
//   export interface PostProps {
//     post: Post;
//     comments: Comment[];
//     likes: PostLikes;
//     onLike: (postId: string) => Promise<void>;
//     onComment: (postId: string, content: string) => Promise<void>;
//     onShare?: (postId: string) => Promise<void>;
//   }