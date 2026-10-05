/*
  Warnings:

  - Added the required column `category` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url_document` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "category" "ProductsCategory" NOT NULL,
ADD COLUMN     "url_document" VARCHAR(255) NOT NULL;
