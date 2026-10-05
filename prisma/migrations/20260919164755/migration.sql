/*
  Warnings:

  - Added the required column `max_stock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "max_stock" INTEGER NOT NULL;
