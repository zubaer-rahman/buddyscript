import api from "@lib/axios";
import { Comment, Reply } from "@shared/types";

export async function addComment(
  text: string,
  postId: number,
): Promise<Comment> {
  const response = await api.post<{ data: Comment }>("/comment", {
    text,
    postId,
  });
  return response.data.data;
}

export async function addReply(
  text: string,
  commentId: number,
): Promise<Reply> {
  const response = await api.post<{ data: Reply }>("/reply", {
    text,
    commentId,
  });
  return response.data.data;
}
