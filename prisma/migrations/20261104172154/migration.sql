/*
  Warnings:

  - You are about to drop the column `value` on the `Cost` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Cost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cost" DROP COLUMN "value",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
