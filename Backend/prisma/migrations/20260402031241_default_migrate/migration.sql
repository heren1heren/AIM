-- CreateTable
CREATE TABLE "_ReadNotifications" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ReadNotifications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ReadNotifications_B_index" ON "_ReadNotifications"("B");

-- AddForeignKey
ALTER TABLE "_ReadNotifications" ADD CONSTRAINT "_ReadNotifications_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadNotifications" ADD CONSTRAINT "_ReadNotifications_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
