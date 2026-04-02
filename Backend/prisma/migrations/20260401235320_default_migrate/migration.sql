-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "_RecipientNotifications" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RecipientNotifications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RecipientNotifications_B_index" ON "_RecipientNotifications"("B");

-- AddForeignKey
ALTER TABLE "_RecipientNotifications" ADD CONSTRAINT "_RecipientNotifications_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientNotifications" ADD CONSTRAINT "_RecipientNotifications_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
