/*
  Warnings:

  - You are about to drop the column `issuedAt` on the `EmployeDocument` table. All the data in the column will be lost.
  - Added the required column `document_url` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" 
    ADD COLUMN "document_url" VARCHAR(255) NOT NULL DEFAULT 'temporary_placeholder',
    ALTER COLUMN "allergens" SET NOT NULL,
    ALTER COLUMN "allergens" SET DATA TYPE "Allergens" USING "allergens"[1]::"Allergens";
