/*
  Warnings:

  - The values [SYSTEM] on the enum `MessageType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `edited_at` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `is_edited` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `attachments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sender_type` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('SYSTEM', 'USER');

-- AlterEnum
BEGIN;
CREATE TYPE "MessageType_new" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO');
ALTER TABLE "messages" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "messages" ALTER COLUMN "type" TYPE "MessageType_new" USING ("type"::text::"MessageType_new");
ALTER TYPE "MessageType" RENAME TO "MessageType_old";
ALTER TYPE "MessageType_new" RENAME TO "MessageType";
DROP TYPE "MessageType_old";
ALTER TABLE "messages" ALTER COLUMN "type" SET DEFAULT 'TEXT';
COMMIT;

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_message_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user_id_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "deleted_at",
DROP COLUMN "edited_at",
DROP COLUMN "is_deleted",
DROP COLUMN "is_edited",
DROP COLUMN "updated_at",
ADD COLUMN     "llm_model" TEXT,
ADD COLUMN     "parent_message_id" UUID,
ADD COLUMN     "response_message_id" UUID,
ADD COLUMN     "sender_type" "MessageSender" NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- DropTable
DROP TABLE "attachments";

-- CreateIndex
CREATE INDEX "chat_user_id_idx" ON "chats"("user_id");

-- CreateIndex
CREATE INDEX "message_chat_id_idx" ON "messages"("chat_id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_response_message_id_fkey" FOREIGN KEY ("response_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
