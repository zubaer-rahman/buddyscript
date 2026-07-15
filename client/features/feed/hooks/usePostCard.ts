import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@lib/queryClient";
import { toast } from "react-hot-toast";
import api from "@lib/axios";
import { feedKeys } from "../types";
import { useLikeMutation } from "./useLikeMutation";
import { useAddComment, useAddReply } from "./useComments";
import { Comment, Like, Post } from "@shared/types";

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

interface CurrentUser {
  id: number;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
}

export function usePostCardUI(post: Post, currentUser: CurrentUser) {
  const [liked, setLiked] = useState(post.isLikedByMe ?? false);
  const [likesCount, setLikesCount] = useState(post.likeCount ?? post.likes?.length ?? 0);
  const [likes, setLikes] = useState<Like[]>(post.likes ?? []);
  const [comments, setComments] = useState<Comment[]>(post.comments ?? []);
  const [totalCommentsCount, setTotalCommentsCount] = useState(post.commentCount ?? post.comments?.length ?? 0);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const likeMutation = useLikeMutation();
  const addCommentMutation = useAddComment();
  const addReplyMutation = useAddReply();

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likesCount;
    const prevLikes = likes;

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((c: number) => c + (liked ? -1 : 1));

    // Optimistically add/remove the current user's avatar head
    if (newLiked) {
      const myLike: Like = {
        id: -1 as unknown as number, // temp id
        userId: currentUser.id,
        postId: post.id,
        user: {
          id: currentUser.id,
          firstName: currentUser.firstName ?? "",
          lastName: currentUser.lastName ?? "",
          avatar: currentUser.avatar ?? null,
        },
      };
      setLikes((prev) => [myLike, ...prev].slice(0, 5));
    } else {
      setLikes((prev) => prev.filter((l) => String(l.userId) !== String(currentUser.id)));
    }

    try {
      await likeMutation.mutateAsync({ entityType: "post", entityId: post.id });
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      setLikes(prevLikes);
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
      setTotalCommentsCount((prev: number) => prev + 1);
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
    likes,
    comments,
    totalCommentsCount,
    commentText,
    setCommentText,
    showAllComments,
    setShowAllComments,
    handleLike,
    handleCommentSubmit,
    handleReplySubmit,
  };
}
