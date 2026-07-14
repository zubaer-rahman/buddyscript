export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface LikeUser {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
  user?: LikeUser;
}

export interface CommentLike {
  id: number;
  userId: number;
  commentId: number;
  user?: LikeUser;
}

export interface ReplyLike {
  id: number;
  userId: number;
  replyId: number;
  user?: LikeUser;
}

export interface Reply {
  id: number;
  text: string;
  author: Author;
  replies?: never;
  likes?: ReplyLike[];
  createdAt: string;
}

export interface Comment {
  id: number;
  text: string;
  author: Author;
  replies: Reply[];
  likes?: CommentLike[];
  createdAt: string;
}

export interface Post {
  id: number;
  text: string | null;
  imageUrl?: string | null;
  isPrivate: boolean;
  author: Author;
  comments: Comment[];
  likes: Like[];
  createdAt: string;
}

export type EntityType = 'post' | 'comment' | 'reply';