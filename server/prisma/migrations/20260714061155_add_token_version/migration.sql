-- DropIndex
DROP INDEX "comment_likes_commentId_userId_key";

-- DropIndex
DROP INDEX "likes_postId_userId_key";

-- DropIndex
DROP INDEX "reply_likes_replyId_userId_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;
