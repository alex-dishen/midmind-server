/*
  Warnings:

  - You are about to drop the column `thread_level` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the `thread_contexts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "thread_contexts" DROP CONSTRAINT "thread_contexts_child_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "thread_contexts" DROP CONSTRAINT "thread_contexts_child_message_id_fkey";

-- DropForeignKey
ALTER TABLE "thread_contexts" DROP CONSTRAINT "thread_contexts_parent_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "thread_contexts" DROP CONSTRAINT "thread_contexts_parent_message_id_fkey";

-- DropIndex
DROP INDEX "chat_root_level_idx";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "thread_level",
ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "thread_contexts";

-- CreateTable
CREATE TABLE "branch_contexts" (
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

    CONSTRAINT "branch_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branch_contexts_child_chat_id_key" ON "branch_contexts"("child_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_contexts_child_message_id_key" ON "branch_contexts"("child_message_id");

-- AddForeignKey
ALTER TABLE "branch_contexts" ADD CONSTRAINT "branch_contexts_child_chat_id_fkey" FOREIGN KEY ("child_chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_contexts" ADD CONSTRAINT "branch_contexts_parent_chat_id_fkey" FOREIGN KEY ("parent_chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_contexts" ADD CONSTRAINT "branch_contexts_child_message_id_fkey" FOREIGN KEY ("child_message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_contexts" ADD CONSTRAINT "branch_contexts_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
