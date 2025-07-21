/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserProvider" AS ENUM ('GOOGLE');

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username",
ADD COLUMN     "provider" "UserProvider",
ADD COLUMN     "provider_id" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
