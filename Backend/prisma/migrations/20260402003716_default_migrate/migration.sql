/*
  Warnings:

  - You are about to drop the column `class_id` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_class_id_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "class_id";

-- CreateTable
CREATE TABLE "_ClassNotifications" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClassNotifications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClassNotifications_B_index" ON "_ClassNotifications"("B");

-- AddForeignKey
ALTER TABLE "_ClassNotifications" ADD CONSTRAINT "_ClassNotifications_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassNotifications" ADD CONSTRAINT "_ClassNotifications_B_fkey" FOREIGN KEY ("B") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
