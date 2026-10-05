/*
  Warnings:

  - Added the required column `img` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "img" VARCHAR(255) NOT NULL;
