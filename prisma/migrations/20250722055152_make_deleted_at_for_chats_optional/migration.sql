-- AlterTable
ALTER TABLE "chats" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
