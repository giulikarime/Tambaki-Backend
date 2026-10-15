/*
  Warnings:

  - Changed the column `category` on the `Supplier` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "category" TYPE "ProductsCategory"[] USING array[category::"ProductsCategory"];
