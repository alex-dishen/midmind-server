/*
  Warnings:

  - Made the column `name` on table `chats` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DirectoryType" AS ENUM ('folder', 'mindlet');

-- DropIndex
DROP INDEX "chat_parent_id_idx";

-- DropIndex
DROP INDEX "chat_root_id_idx";

UPDATE chats
SET name = 'New conversation'
WHERE name IS NULL;

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "directory_id" UUID,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "directories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "root_directory_id" UUID,
    "parent_directory_id" UUID,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "type" "DirectoryType" NOT NULL,
    "path" TEXT[],

    CONSTRAINT "directories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "directory_user_id_idx" ON "directories"("user_id");

-- CreateIndex
CREATE INDEX "chat_directory_id_idx" ON "chats"("directory_id");

-- AddForeignKey
ALTER TABLE "directories" ADD CONSTRAINT "directories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directories" ADD CONSTRAINT "directories_root_directory_id_fkey" FOREIGN KEY ("root_directory_id") REFERENCES "directories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directories" ADD CONSTRAINT "directories_parent_directory_id_fkey" FOREIGN KEY ("parent_directory_id") REFERENCES "directories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_directory_id_fkey" FOREIGN KEY ("directory_id") REFERENCES "directories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
