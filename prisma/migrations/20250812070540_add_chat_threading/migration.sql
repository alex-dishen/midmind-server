-- CreateTable
CREATE TABLE "message_replies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message_id" UUID NOT NULL,
    "message_id_replied_to" UUID NOT NULL,
    "reply_content" TEXT NOT NULL,

    CONSTRAINT "message_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "message_replies_message_id_message_id_replied_to_key" ON "message_replies"("message_id", "message_id_replied_to");

-- AddForeignKey
ALTER TABLE "message_replies" ADD CONSTRAINT "message_replies_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_replies" ADD CONSTRAINT "message_replies_message_id_replied_to_fkey" FOREIGN KEY ("message_id_replied_to") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
