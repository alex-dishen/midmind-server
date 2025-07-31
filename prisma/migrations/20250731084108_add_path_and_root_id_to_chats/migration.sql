-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "path" TEXT[],
ADD COLUMN     "root_chat_id" UUID;

-- CreateIndex
CREATE INDEX "chat_root_id_idx" ON "chats"("root_chat_id");

-- CreateIndex
CREATE INDEX "chat_root_level_idx" ON "chats"("root_chat_id", "thread_level");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_root_chat_id_fkey" FOREIGN KEY ("root_chat_id") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
