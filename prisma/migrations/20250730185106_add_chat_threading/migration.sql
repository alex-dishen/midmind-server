/*
  Warnings:

  - You are about to drop the column `type` on the `messages` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ConnectionType" AS ENUM ('attached', 'detached', 'temporary');

-- CreateEnum
CREATE TYPE "ContextType" AS ENUM ('full_message', 'text_selection');

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "parent_chat_id" UUID,
ADD COLUMN     "position_x" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "position_y" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "thread_level" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "type";

-- DropEnum
DROP TYPE "MessageType";

-- CreateTable
CREATE TABLE "thread_contexts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "child_chat_id" UUID NOT NULL,
    "parent_chat_id" UUID NOT NULL,
    "parent_message_id" UUID NOT NULL,
    "child_message_id" UUID NOT NULL,
    "selected_text" TEXT,
    "start_position" INTEGER,
    "end_position" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "context_type" "ContextType" NOT NULL,
    "connection_type" "ConnectionType" NOT NULL,
    "connection_color" TEXT NOT NULL,

    CONSTRAINT "thread_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "thread_contexts_child_chat_id_key" ON "thread_contexts"("child_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "thread_contexts_child_message_id_key" ON "thread_contexts"("child_message_id");

-- CreateIndex
CREATE INDEX "chat_parent_id_idx" ON "chats"("parent_chat_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_parent_chat_id_fkey" FOREIGN KEY ("parent_chat_id") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_contexts" ADD CONSTRAINT "thread_contexts_child_chat_id_fkey" FOREIGN KEY ("child_chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_contexts" ADD CONSTRAINT "thread_contexts_parent_chat_id_fkey" FOREIGN KEY ("parent_chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_contexts" ADD CONSTRAINT "thread_contexts_child_message_id_fkey" FOREIGN KEY ("child_message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_contexts" ADD CONSTRAINT "thread_contexts_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
