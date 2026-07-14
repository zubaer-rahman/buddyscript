"use client";

import { useRef, useState, useEffect } from "react";
import { useAuthStore } from "@store/auth/authStore";
import { getUserAvatar } from "@utils/avatar";
import { Post } from "@shared/types";
import { useCreatePostForm } from "../hooks/useCreatePostForm";

interface CreatePostModalProps {
  show: boolean;
  initialText?: string;
  initialFile?: File | null;
  editingPost?: Post | null;
  onClose: () => void;
}

export default function CreatePostModal({
  show,
  initialText = "",
  initialFile = null,
  editingPost = null,
  onClose,
}: CreatePostModalProps) {
  const { user } = useAuthStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEditing = !!editingPost;

  const {
    text,
    setText,
    isPrivate,
    setIsPrivate,
    selectedFile,
    setSelectedFile,
    existingImageRemoved,
    setExistingImageRemoved,
    createMutation,
    editMutation,
    isSubmitting,
  } = useCreatePostForm(onClose);

  useEffect(() => {
    if (show) {
      setText(initialText || editingPost?.text || "");
      setSelectedFile(initialFile);
      setIsPrivate(editingPost?.isPrivate ?? false);
      setExistingImageRemoved(false);
    }
  }, [
    show,
    initialText,
    initialFile,
    editingPost,
    setText,
    setSelectedFile,
    setIsPrivate,
    setExistingImageRemoved,
  ]);

  useEffect(() => {
    if (show && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [show]);

  const handleImageRemove = () => {
    setSelectedFile(null);
    if (isEditing && editingPost?.imageUrl) {
      setExistingImageRemoved(true);
    }
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed && !selectedFile && !isEditing) return;

    if (isEditing && editingPost) {
      editMutation.mutate({
        postId: editingPost.id,
        text: trimmed,
        isPrivate,
        image: selectedFile,
        existingImageRemoved,
      });
    } else {
      createMutation.mutate({ text: trimmed, isPrivate, image: selectedFile });
    }
  };

  if (!show || !user) return null;

  const avatarSrc = getUserAvatar(user);
  const existingImageUrl =
    isEditing && editingPost?.imageUrl && !existingImageRemoved && !selectedFile
      ? editingPost.imageUrl
      : null;
  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : existingImageUrl;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "90%",
          maxWidth: 500,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #e4e6eb",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 600, color: "#050505" }}>
            {isEditing ? "Edit Post" : "Create Post"}
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "#e4e6eb",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "#606770",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "12px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={avatarSrc}
              alt="Avatar"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span style={{ fontWeight: 600, fontSize: 15, color: "#050505" }}>
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>

        <div style={{ padding: "12px 20px", flex: 1, overflowY: "auto" }}>
          <textarea
            ref={textareaRef}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 16,
              lineHeight: 1.4,
              color: "#050505",
              fontFamily: "inherit",
              minHeight: 120,
            }}
          />

          {previewUrl && (
            <div
              style={{
                position: "relative",
                marginTop: 12,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                  borderRadius: 8,
                  display: "block",
                }}
              />
              <button
                type="button"
                onClick={handleImageRemove}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #e4e6eb",
            borderBottom: "1px solid #e4e6eb",
            margin: "0 20px",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: "#050505" }}>
            Privacy
          </span>
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid #ced0d4",
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              color: "#050505",
            }}
          >
            <span>{isPrivate ? "🔒" : "🌍"}</span>
            <span>{isPrivate ? "Private" : "Public"}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="#050505"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div style={{ padding: "12px 20px 16px" }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting || (!text.trim() && !selectedFile && !isEditing)
            }
            style={{
              width: "100%",
              padding: "10px 0",
              border: "none",
              borderRadius: 8,
              background:
                isSubmitting || (!text.trim() && !selectedFile && !isEditing)
                  ? "#e4e6eb"
                  : "#0866ff",
              color:
                isSubmitting || (!text.trim() && !selectedFile && !isEditing)
                  ? "#bcc0c4"
                  : "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor:
                isSubmitting || (!text.trim() && !selectedFile && !isEditing)
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isSubmitting
              ? isEditing
                ? "Saving..."
                : "Posting..."
              : isEditing
                ? "Save"
                : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
