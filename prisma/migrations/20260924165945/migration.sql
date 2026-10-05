/*
  Warnings:

  - Added the required column `measure_unit_of_product` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "measure_unit_of_product" "UnitOfMeasure" NOT NULL;
