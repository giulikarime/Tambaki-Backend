/*
  Warnings:

  - You are about to drop the column `endsAt` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Reservation_tableId_startsAt_endsAt_idx";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "endsAt";

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produtoID" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reservation_tableId_startsAt_idx" ON "Reservation"("tableId", "startsAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_produtoID_fkey" FOREIGN KEY ("produtoID") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
