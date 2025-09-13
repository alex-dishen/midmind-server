/*
  Warnings:

  - You are about to drop the `chat-metadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat-metadata" DROP CONSTRAINT "chat-metadata_child_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "chat-metadata" DROP CONSTRAINT "chat-metadata_child_message_id_fkey";

-- DropForeignKey
ALTER TABLE "chat-metadata" DROP CONSTRAINT "chat-metadata_parent_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "chat-metadata" DROP CONSTRAINT "chat-metadata_parent_message_id_fkey";

-- DropTable
DROP TABLE "chat-metadata";

-- CreateTable
CREATE TABLE "chat_metadata" (
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

    CONSTRAINT "chat_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_metadata_child_chat_id_key" ON "chat_metadata"("child_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_metadata_child_message_id_key" ON "chat_metadata"("child_message_id");

-- AddForeignKey
ALTER TABLE "chat_metadata" ADD CONSTRAINT "chat_metadata_child_chat_id_fkey" FOREIGN KEY ("child_chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_metadata" ADD CONSTRAINT "chat_metadata_parent_chat_id_fkey" FOREIGN KEY ("parent_chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_metadata" ADD CONSTRAINT "chat_metadata_child_message_id_fkey" FOREIGN KEY ("child_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_metadata" ADD CONSTRAINT "chat_metadata_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
