/*
  Warnings:

  - You are about to drop the `NotificationTarget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotificationTarget" DROP CONSTRAINT "NotificationTarget_class_id_fkey";

-- DropForeignKey
ALTER TABLE "NotificationTarget" DROP CONSTRAINT "NotificationTarget_notification_id_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "class_id" INTEGER,
ADD COLUMN     "is_for_students" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_for_teachers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_global" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "NotificationTarget";

-- DropEnum
DROP TYPE "NotificationRole";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
