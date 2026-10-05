/*
  Warnings:

  - You are about to drop the `EmployeDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmployeDocument" DROP CONSTRAINT "EmployeDocument_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "employe_document" TEXT;

-- DropTable
DROP TABLE "EmployeDocument";
