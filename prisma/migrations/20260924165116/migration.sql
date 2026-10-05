/*
  Warnings:

  - Added the required column `unit_of_product` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "unit_of_product" INTEGER NOT NULL;
