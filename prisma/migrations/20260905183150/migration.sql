/*
  Warnings:

  - You are about to drop the column `batch` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `storageLocation` on the `Product` table. All the data in the column will be lost.
  - Added the required column `allergensType` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandType` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryType` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageLocationType` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('EXISTING', 'CUSTOM');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "batch",
DROP COLUMN "brand",
DROP COLUMN "category",
DROP COLUMN "storageLocation",
ADD COLUMN     "allergensText" TEXT,
ADD COLUMN     "allergensType" "ItemType" NOT NULL,
ADD COLUMN     "batchId" INTEGER,
ADD COLUMN     "batchText" TEXT,
ADD COLUMN     "brandId" INTEGER,
ADD COLUMN     "brandText" TEXT,
ADD COLUMN     "brandType" "ItemType" NOT NULL,
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "categoryText" TEXT,
ADD COLUMN     "categoryType" "ItemType" NOT NULL,
ADD COLUMN     "storageLocationId" INTEGER,
ADD COLUMN     "storageLocationText" TEXT,
ADD COLUMN     "storageLocationType" "ItemType" NOT NULL;

-- DropEnum
DROP TYPE "ProductBatch";

-- DropEnum
DROP TYPE "ProductStorageLocation";

-- DropEnum
DROP TYPE "ProductsCategory";

-- CreateTable
CREATE TABLE "ProductsCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "ProductsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductStorageLocation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "ProductStorageLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBrand" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "ProductBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBatch" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "ProductBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductsCategory_name_key" ON "ProductsCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductStorageLocation_name_key" ON "ProductStorageLocation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductBrand_name_key" ON "ProductBrand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductBatch_name_key" ON "ProductBatch"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductsCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "ProductBrand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "ProductStorageLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
