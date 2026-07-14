import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@lib/queryClient";
import { toast } from "react-hot-toast";
import api from "@lib/axios";
import { feedKeys } from "../types";

interface CreatePostInput {
  text: string;
  isPrivate: boolean;
  image?: File | null;
}

interface EditPostInput extends CreatePostInput {
  postId: number;
  existingImageRemoved?: boolean;
}

export function useCreatePostForm(onSuccess?: () => void) {
  const [text, setText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const formData = new FormData();
      formData.append("text", input.text);
      formData.append("isPrivate", String(input.isPrivate));
      if (input.image) formData.append("image", input.image);
      const res = await api.post("/post", formData);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.posts });
      toast.success("Post shared successfully!");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const editMutation = useMutation({
    mutationFn: async (input: EditPostInput) => {
      const formData = new FormData();
      formData.append("text", input.text);
      formData.append("isPrivate", String(input.isPrivate));
      if (input.image) formData.append("image", input.image);
      if (input.existingImageRemoved && !input.image) {
        formData.append("imageUrl", "");
      }
      const res = await api.patch(`/post/${input.postId}`, formData);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.posts });
      toast.success("Post updated successfully!");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const resetForm = useCallback(() => {
    setText("");
    setIsPrivate(false);
    setSelectedFile(null);
    setExistingImageRemoved(false);
  }, []);

  return {
    text,
    setText,
    isPrivate,
    setIsPrivate,
    selectedFile,
    setSelectedFile,
    existingImageRemoved,
    setExistingImageRemoved,
    resetForm,
    createMutation,
    editMutation,
    isSubmitting: createMutation.isPending || editMutation.isPending,
  };
}
