-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "is_for_students" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_for_teachers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_global" BOOLEAN NOT NULL DEFAULT false;
