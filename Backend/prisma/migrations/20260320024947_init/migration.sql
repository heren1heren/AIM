/*
  Warnings:

  - Added the required column `assignedDate` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignedDate` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "assignedDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "assignedDate" TIMESTAMP(3) NOT NULL;
