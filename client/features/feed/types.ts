// ─── Post Author ─────────────────────────────────────────────────────────────
export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

// ─── Post ─────────────────────────────────────────────────────────────────────
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
  /** Present in feed response: single element if current user liked, empty otherwise */
  likes: { userId: string }[];
}

// ─── Feed API response ────────────────────────────────────────────────────────
export interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

// ─── Create/Update post payload ───────────────────────────────────────────────
export interface CreatePostPayload {
  text?: string;
  isPrivate?: boolean;
  image?: File | null;
}

// ─── Toggle like payload ──────────────────────────────────────────────────────
export type LikeEntityType = "post" | "comment" | "reply";

export interface ToggleLikePayload {
  entityType: LikeEntityType;
  entityId: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  message: string;
}
