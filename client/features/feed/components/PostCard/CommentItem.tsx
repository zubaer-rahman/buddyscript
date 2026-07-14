"use client";

import Link from "next/link";
import { useState } from "react";
import { getUserAvatar } from "@utils/avatar";
import { useLikeMutation } from "@features/feed/hooks/useLikeMutation";
import { shortTimeAgo } from "@features/feed/utils/timeAgo";
import { type Comment } from "@shared/types";
import { ReplyItem } from "./ReplyItem";

interface CommentItemProps {
  comment: Comment;
  currentUser: {
    id: number;
    avatar?: string | null;
    firstName?: string;
    lastName?: string;
  };
  onReply: (commentId: number, text: string) => void;
}

export function CommentItem({
  comment,
  currentUser,
  onReply,
}: CommentItemProps) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [liked, setLiked] = useState(
    comment.likes?.some((l) => l.userId === currentUser.id) ?? false,
  );
  const [likesCount, setLikesCount] = useState(comment.likes?.length ?? 0);
  const likeMutation = useLikeMutation();

  const likers =
    comment.likes
      ?.map((l) => (l.user ? `${l.user.firstName} ${l.user.lastName}` : ""))
      .filter(Boolean)
      .join(", ") || "";

  const handleLike = async () => {
    const prev = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount((c) => c + (liked ? -1 : 1));
    try {
      await likeMutation.mutateAsync({
        entityType: "comment",
        entityId: comment.id,
      });
    } catch {
      setLiked(prev);
      setLikesCount(prevCount);
    }
  };

  const handleReplyFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReply(comment.id, replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <Link href="/profile" className="_comment_image_link">
          <img
            src={getUserAvatar(comment.author)}
            alt=""
            className="_comment_img1"
          />
        </Link>
      </div>
      <div className="_comment_area">
        <div
          className="_comment_details"
          style={{ width: "100%", maxWidth: "100%" }}
        >
          <div className="_comment_details_top">
            <div className="_comment_name">
              <Link href="/profile">
                <h4 className="_comment_name_title">
                  {comment.author.firstName} {comment.author.lastName}
                </h4>
              </Link>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.text}</span>
            </p>
          </div>
          <div className="_total_reactions">
            <div className="_total_react">
              <span className="_reaction_like">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </span>
              <span className="_reaction_heart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </span>
            </div>
            <span className="_total" title={likers || undefined}>
              {likesCount}
            </span>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <button
                    type="button"
                    className="_time_link"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: liked ? "#1890FF" : "inherit",
                      fontWeight: liked ? 700 : "inherit",
                      cursor: "pointer",
                    }}
                    onClick={handleLike}
                  >
                    Like
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="_time_link"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "inherit",
                    }}
                    onClick={() => setShowReplyInput(!showReplyInput)}
                  >
                    Reply
                  </button>
                </li>
                <li>
                  <span>Share</span>
                </li>
                <li>
                  <span className="_time_link">
                    {shortTimeAgo(comment.createdAt)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {(comment.replies ?? []).map((reply) => (
          <ReplyItem key={reply.id} reply={reply} currentUser={currentUser} />
        ))}
        {showReplyInput && (
          <div
            className="_feed_inner_comment_box"
            style={{ marginTop: "24px", marginBottom: "24px" }}
          >
            <form
              className="_feed_inner_comment_box_form"
              onSubmit={handleReplyFormSubmit}
            >
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img
                    src={getUserAvatar(currentUser)}
                    alt=""
                    className="_comment_img"
                  />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReplyFormSubmit(e);
                      }
                    }}
                  ></textarea>
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                {replyText.trim() ? (
                  <button
                    type="submit"
                    className="_feed_inner_comment_box_icon_btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 2L11 13"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 2L15 22l-4-9-9-4z"
                      />
                    </svg>
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
