/*
  Warnings:

  - You are about to drop the column `businnes_hours` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `payment_terms` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "businnes_hours",
DROP COLUMN "payment_terms";
