import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@lib/queryClient";
import { toast } from "react-hot-toast";
import api from "@lib/axios";
import { feedKeys } from "../types";
import { useLikeMutation } from "./useLikeMutation";
import { useAddComment, useAddReply } from "./useComments";
import { Comment, Post } from "@shared/types";

export function useDeletePost() {
  return useMutation({
    mutationFn: (postId: number) => api.delete(`/post/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.posts });
      toast.success("Post deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete post. Please try again.");
    },
  });
}

export function usePostCardUI(post: Post, currentUserId: number) {
  const [liked, setLiked] = useState(
    post.likes?.some((l) => l.userId === currentUserId) ?? false,
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length ?? 0);
  const [comments, setComments] = useState<Comment[]>(post.comments ?? []);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const likeMutation = useLikeMutation();
  const addCommentMutation = useAddComment();
  const addReplyMutation = useAddReply();

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount((c) => c + (liked ? -1 : 1));
    try {
      await likeMutation.mutateAsync({ entityType: "post", entityId: post.id });
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    const prevText = commentText;
    setCommentText("");
    try {
      const newComment = await addCommentMutation.mutateAsync({
        text,
        postId: post.id,
      });
      setComments((prev) => [...prev, newComment]);
    } catch {
      setCommentText(prevText);
    }
  };

  const handleReplySubmit = async (commentId: number, text: string) => {
    if (!text.trim()) return;
    try {
      const newReply = await addReplyMutation.mutateAsync({ text, commentId });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies ?? []), newReply] }
            : c,
        ),
      );
    } catch {}
  };

  return {
    liked,
    likesCount,
    comments,
    commentText,
    setCommentText,
    showAllComments,
    setShowAllComments,
    handleLike,
    handleCommentSubmit,
    handleReplySubmit,
  };
}
