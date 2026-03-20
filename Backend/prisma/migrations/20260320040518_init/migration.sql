/*
  Warnings:

  - You are about to drop the column `is_for_students` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `is_for_teachers` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `is_global` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "is_for_students",
DROP COLUMN "is_for_teachers",
DROP COLUMN "is_global";
