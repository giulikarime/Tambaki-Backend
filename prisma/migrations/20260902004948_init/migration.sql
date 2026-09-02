/*
  Warnings:

  - Added the required column `batch` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageLocation` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductStorageLocation" AS ENUM ('CamaraFria', 'Freezer', 'Geladeira', 'Despensa_EstoqueSeco', 'Bar_Adega', 'Descartaveis', 'Outro');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('Ativo', 'Inativo', 'Descontinuado');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "batch" VARCHAR(30) NOT NULL,
ADD COLUMN     "status" "ProductStatus" NOT NULL,
ADD COLUMN     "storageLocation" "ProductStorageLocation" NOT NULL;
