-- Rename table from "chat-metadata" to "chat_metadata"
ALTER TABLE "chat-metadata" RENAME TO "chat_metadata";

-- Rename constraints to match new table name
ALTER TABLE "chat_metadata" RENAME CONSTRAINT "chat-metadata_pkey" TO "chat_metadata_pkey";
ALTER TABLE "chat_metadata" RENAME CONSTRAINT "chat-metadata_child_chat_id_fkey" TO "chat_metadata_child_chat_id_fkey";
ALTER TABLE "chat_metadata" RENAME CONSTRAINT "chat-metadata_parent_chat_id_fkey" TO "chat_metadata_parent_chat_id_fkey";
ALTER TABLE "chat_metadata" RENAME CONSTRAINT "chat-metadata_child_message_id_fkey" TO "chat_metadata_child_message_id_fkey";
ALTER TABLE "chat_metadata" RENAME CONSTRAINT "chat-metadata_parent_message_id_fkey" TO "chat_metadata_parent_message_id_fkey";

-- Rename indexes to match new table name
ALTER INDEX "chat-metadata_child_chat_id_key" RENAME TO "chat_metadata_child_chat_id_key";
ALTER INDEX "chat-metadata_child_message_id_key" RENAME TO "chat_metadata_child_message_id_key";