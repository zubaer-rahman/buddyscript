 export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

 export interface Post {
  id: string;
  text: string | null;
  imageUrl: string | null;
  isPrivate: boolean;
  authorId: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
   likes: { userId: string }[];
}

 export interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

 export interface CreatePostPayload {
  text?: string;
  isPrivate?: boolean;
  image?: File | null;
}

 export type LikeEntityType = "post" | "comment" | "reply";

export interface ToggleLikePayload {
  entityType: LikeEntityType;
  entityId: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  message: string;
}

export const feedKeys = {
  posts: ["posts"] as const,
};