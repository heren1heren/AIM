/*
  Warnings:

  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bias" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "UserProfile";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
