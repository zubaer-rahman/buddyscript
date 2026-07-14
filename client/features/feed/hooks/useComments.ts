import { useMutation } from "@tanstack/react-query";
import { addComment, addReply } from "../api/commentsApi";

export function useAddComment() {
  return useMutation({
    mutationFn: ({ text, postId }: { text: string; postId: number }) =>
      addComment(text, postId),
  });
}

export function useAddReply() {
  return useMutation({
    mutationFn: ({ text, commentId }: { text: string; commentId: number }) =>
      addReply(text, commentId),
  });
}
