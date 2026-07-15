"use client";

import Link from "next/link";
import { useState } from "react";
import { getUserAvatar } from "@utils/avatar";
import { useLikeMutation } from "../../hooks/useLikeMutation";
import { shortTimeAgo } from "../../utils/timeAgo";
import { Reply } from "@shared/types";

interface ReplyItemProps {
  reply: Reply;
  currentUser: {
    id: number;
    avatar?: string | null;
    firstName?: string;
    lastName?: string;
  };
}

export function ReplyItem({ reply, currentUser }: ReplyItemProps) {
  const [liked, setLiked] = useState(
    reply.likes?.some((l) => String(l.userId) === String(currentUser.id)) ?? false,
  );
  const [likesCount, setLikesCount] = useState(reply.likeCount ?? reply.likes?.length ?? 0);
  const likeMutation = useLikeMutation();

  const likers =
    reply.likes
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
        entityType: "reply",
        entityId: reply.id,
      });
    } catch {
      setLiked(prev);
      setLikesCount(prevCount);
    }
  };

  return (
    <div className="_comment_main" style={{ marginTop: 8 }}>
      <div
        className="_comment_image"
        style={{ width: 32, height: 32, flex: "0 0 32px" }}
      >
        <Link href="/profile" className="_comment_image_link">
          <img
            src={getUserAvatar(reply.author)}
            alt=""
            className="_comment_img1"
            style={{ maxWidth: 32 }}
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
                  {reply.author.firstName} {reply.author.lastName}
                </h4>
              </Link>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{reply.text}</span>
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
                  <span className="_time_link">
                    {shortTimeAgo(reply.createdAt)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
