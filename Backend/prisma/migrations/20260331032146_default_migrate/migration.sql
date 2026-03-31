/*
  Warnings:

  - You are about to drop the column `avatarFileId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_avatarFileId_fkey";

-- DropIndex
DROP INDEX "User_avatarFileId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarFileId",
ADD COLUMN     "avatarKey" TEXT;
