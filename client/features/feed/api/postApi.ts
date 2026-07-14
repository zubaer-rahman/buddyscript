import api from "@lib/axios";
import { Post } from "@shared/types";

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface FeedPage {
  posts: Post[];
  nextCursor: string | null;
}

export async function fetchFeedPage(
  cursor?: string,
  limit = 10,
): Promise<FeedPage> {
  const response = await api.get<ApiEnvelope<FeedPage>>("/post", {
    params: { cursor, limit },
  });
  return response.data.data;
}
