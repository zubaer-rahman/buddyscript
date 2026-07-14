-- Migration: denormalized_counts_composite_pks_compound_indexes
-- Batches: #12 (likeCount/commentCount), #13 (composite PKs on like tables), #14 (authorId indexes), #5 (compound indexes)

-- ============================================================
-- 1. Add denormalized count columns to posts
-- ============================================================
ALTER TABLE "posts"
  ADD COLUMN "likeCount"    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "commentCount" INTEGER NOT NULL DEFAULT 0;

-- ============================================================
-- 2. Add denormalized likeCount to comments
-- ============================================================
ALTER TABLE "comments"
  ADD COLUMN "likeCount" INTEGER NOT NULL DEFAULT 0;

-- ============================================================
-- 3. Add denormalized likeCount to replies
-- ============================================================
ALTER TABLE "replies"
  ADD COLUMN "likeCount" INTEGER NOT NULL DEFAULT 0;

-- ============================================================
-- 4. Fix Like table: drop redundant id column, promote composite unique → PK
-- ============================================================
ALTER TABLE "likes" DROP CONSTRAINT IF EXISTS "likes_pkey";
ALTER TABLE "likes" DROP CONSTRAINT IF EXISTS "likes_postId_userId_key";
ALTER TABLE "likes" DROP COLUMN IF EXISTS "id";
ALTER TABLE "likes" ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("postId", "userId");

-- ============================================================
-- 5. Fix CommentLike table: same as above
-- ============================================================
ALTER TABLE "comment_likes" DROP CONSTRAINT IF EXISTS "comment_likes_pkey";
ALTER TABLE "comment_likes" DROP CONSTRAINT IF EXISTS "comment_likes_commentId_userId_key";
ALTER TABLE "comment_likes" DROP COLUMN IF EXISTS "id";
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("commentId", "userId");

-- ============================================================
-- 6. Fix ReplyLike table: same as above
-- ============================================================
ALTER TABLE "reply_likes" DROP CONSTRAINT IF EXISTS "reply_likes_pkey";
ALTER TABLE "reply_likes" DROP CONSTRAINT IF EXISTS "reply_likes_replyId_userId_key";
ALTER TABLE "reply_likes" DROP COLUMN IF EXISTS "id";
ALTER TABLE "reply_likes" ADD CONSTRAINT "reply_likes_pkey" PRIMARY KEY ("replyId", "userId");

-- ============================================================
-- 7. Drop old single-column indexes and add compound indexes on posts
-- ============================================================
DROP INDEX IF EXISTS "posts_authorId_idx";
CREATE INDEX "posts_authorId_createdAt_idx" ON "posts" ("authorId", "createdAt" DESC);
CREATE INDEX "posts_isPrivate_createdAt_idx" ON "posts" ("isPrivate", "createdAt" DESC);

-- ============================================================
-- 8. Drop old single-column index and add compound indexes on comments
-- ============================================================
DROP INDEX IF EXISTS "comments_postId_idx";
CREATE INDEX "comments_postId_createdAt_idx" ON "comments" ("postId", "createdAt" ASC);
CREATE INDEX "comments_authorId_createdAt_idx" ON "comments" ("authorId", "createdAt" DESC);

-- ============================================================
-- 9. Drop old single-column index and add compound indexes on replies
-- ============================================================
DROP INDEX IF EXISTS "replies_commentId_idx";
CREATE INDEX "replies_commentId_createdAt_idx" ON "replies" ("commentId", "createdAt" ASC);
CREATE INDEX "replies_authorId_createdAt_idx" ON "replies" ("authorId", "createdAt" DESC);
