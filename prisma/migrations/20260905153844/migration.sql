/*
  Warnings:

  - Changed the type of `batch` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductBatch" AS ENUM ('Outro');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "batch",
ADD COLUMN     "batch" "ProductBatch" NOT NULL;
