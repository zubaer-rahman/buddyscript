import { useInfiniteQuery } from "@tanstack/react-query";
 import { feedKeys } from "../types";
import { fetchFeedPage } from "../api/postApi";
 
export function usePosts() {
  const query = useInfiniteQuery({
    queryKey: feedKeys.posts,
    queryFn: ({ pageParam }) => fetchFeedPage(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const posts = query.data?.pages.flatMap((page) => page.posts) ?? [];

  return {
    posts,
    loading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
