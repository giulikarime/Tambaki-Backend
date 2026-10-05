/*
  Warnings:

  - You are about to drop the column `issuedAt` on the `EmployeDocument` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeDocument" DROP COLUMN "issuedAt";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "document_url" DROP DEFAULT;
