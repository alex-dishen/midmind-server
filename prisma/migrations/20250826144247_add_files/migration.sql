-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('pending_upload', 'uploaded');

-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('image', 'document');

-- CreateEnum
CREATE TYPE "FileBindingType" AS ENUM ('message');

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bucket" VARCHAR(128) NOT NULL,
    "object_key" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "extension" VARCHAR(16) NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "category" "FileCategory" NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "status" "FileStatus" NOT NULL DEFAULT 'pending_upload',
    "uploader_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_bindings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "file_id" UUID NOT NULL,
    "target_type" "FileBindingType" NOT NULL,
    "target_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_bindings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_bucket_object_key_key" ON "files"("bucket", "object_key");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_bindings" ADD CONSTRAINT "file_bindings_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
