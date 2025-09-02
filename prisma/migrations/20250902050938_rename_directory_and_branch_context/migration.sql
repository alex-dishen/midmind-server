/*
  Warnings:

  - You are about to drop the column `directory_id` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the `branch_contexts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `directories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "branch_contexts" DROP CONSTRAINT "branch_contexts_child_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "branch_contexts" DROP CONSTRAINT "branch_contexts_child_message_id_fkey";

-- DropForeignKey
ALTER TABLE "branch_contexts" DROP CONSTRAINT "branch_contexts_parent_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "branch_contexts" DROP CONSTRAINT "branch_contexts_parent_message_id_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_directory_id_fkey";

-- DropForeignKey
ALTER TABLE "directories" DROP CONSTRAINT "directories_parent_directory_id_fkey";

-- DropForeignKey
ALTER TABLE "directories" DROP CONSTRAINT "directories_root_directory_id_fkey";

-- DropForeignKey
ALTER TABLE "directories" DROP CONSTRAINT "directories_user_id_fkey";

-- DropIndex
DROP INDEX "chat_directory_id_idx";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "directory_id",
ADD COLUMN     "folder_id" UUID;

-- DropTable
DROP TABLE "branch_contexts";

-- DropTable
DROP TABLE "directories";

-- DropEnum
DROP TYPE "DirectoryType";

-- CreateTable
CREATE TABLE "chat-metadata" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "child_chat_id" UUID NOT NULL,
    "parent_chat_id" UUID NOT NULL,
    "parent_message_id" UUID NOT NULL,
    "child_message_id" UUID,
    "selected_text" TEXT,
    "start_position" INTEGER,
    "end_position" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "context_type" "ContextType" NOT NULL,
    "connection_type" "ConnectionType" NOT NULL,
    "connection_color" TEXT NOT NULL,

    CONSTRAINT "chat-metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "root_folder_id" UUID,
    "parent_folder_id" UUID,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "path" TEXT[],

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat-metadata_child_chat_id_key" ON "chat-metadata"("child_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat-metadata_child_message_id_key" ON "chat-metadata"("child_message_id");

-- CreateIndex
CREATE INDEX "folder_user_id_idx" ON "folders"("user_id");

-- CreateIndex
CREATE INDEX "chat_folder_id_idx" ON "chats"("folder_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat-metadata" ADD CONSTRAINT "chat-metadata_child_chat_id_fkey" FOREIGN KEY ("child_chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat-metadata" ADD CONSTRAINT "chat-metadata_parent_chat_id_fkey" FOREIGN KEY ("parent_chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat-metadata" ADD CONSTRAINT "chat-metadata_child_message_id_fkey" FOREIGN KEY ("child_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat-metadata" ADD CONSTRAINT "chat-metadata_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_root_folder_id_fkey" FOREIGN KEY ("root_folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
