"use client";

import { Post } from "@shared/types";
import PostSkeleton from "./PostSkeleton";
import FeedPostCard from "./PostCard/FeedPostCard";
 

interface PostListProps {
  posts: Post[];
  loading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  currentUser: { id: number; avatar?: string | null; firstName?: string; lastName?: string } | null;
}

export function PostList({
  posts,
  loading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  currentUser,
}: PostListProps) {
  if (loading) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </>
    );
  }

  return (
    <>
      {posts.map((post) =>
        currentUser ? <FeedPostCard key={post.id} post={post} currentUser={currentUser} /> : null,
      )}
      {hasNextPage && (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="btn btn-primary"
          >
            {isFetchingNextPage ? "Loading more..." : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}