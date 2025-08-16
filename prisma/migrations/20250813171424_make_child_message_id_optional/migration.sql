-- DropForeignKey
ALTER TABLE "branch_contexts" DROP CONSTRAINT "branch_contexts_child_message_id_fkey";

-- AlterTable
ALTER TABLE "branch_contexts" ALTER COLUMN "child_message_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "branch_contexts" ADD CONSTRAINT "branch_contexts_child_message_id_fkey" FOREIGN KEY ("child_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
