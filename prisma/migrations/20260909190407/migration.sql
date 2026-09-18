/*
  Warnings:

  - Added the required column `nameClient` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "nameClient" VARCHAR(155) NOT NULL;
