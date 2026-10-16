/*
  Warnings:

  - Added the required column `value` to the `Cost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cost" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;
