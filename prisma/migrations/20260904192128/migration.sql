/*
  Warnings:

  - You are about to drop the column `available` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `current_stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `endsAt` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Reservation` table. All the data in the column will be lost.
  - Changed the type of `unit_of_measure` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `endsAtDate` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endsAtHours` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAtDate` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAtHours` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Reservation_tableId_startsAt_endsAt_idx";

-- DropIndex
DROP INDEX "Reservation_tableId_startsAt_idx";

-- DropIndex
DROP INDEX "Reservation_unitId_startsAt_idx";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "createDate" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "EmployeDocument" ALTER COLUMN "issuedAt" SET DATA TYPE DATE,
ALTER COLUMN "valid_until" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "available",
DROP COLUMN "current_stock",
DROP COLUMN "unit_of_measure",
ADD COLUMN     "unit_of_measure" "UnitOfMeasure" NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "endsAt",
DROP COLUMN "startsAt",
ADD COLUMN     "endsAtDate" DATE NOT NULL,
ADD COLUMN     "endsAtHours" TIME NOT NULL,
ADD COLUMN     "startsAtDate" DATE NOT NULL,
ADD COLUMN     "startsAtHours" TIME NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "hire_date" SET DATA TYPE DATE;

-- CreateIndex
CREATE INDEX "Reservation_tableId_startsAtDate_startsAtHours_idx" ON "Reservation"("tableId", "startsAtDate", "startsAtHours");

-- CreateIndex
CREATE INDEX "Reservation_unitId_endsAtDate_endsAtHours_idx" ON "Reservation"("unitId", "endsAtDate", "endsAtHours");
