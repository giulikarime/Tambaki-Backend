/*
  Warnings:

  - You are about to alter the column `salary` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "salary" SET DATA TYPE DOUBLE PRECISION;
