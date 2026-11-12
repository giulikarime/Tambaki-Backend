/*
  Warnings:

  - You are about to drop the `TotalCostFixed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TotalCostVariable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CostToTotalCostFixed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CostToTotalCostVariable` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updateAt` to the `Cost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeOfMovement" AS ENUM ('Entrada', 'Saida');

-- DropForeignKey
ALTER TABLE "_CostToTotalCostFixed" DROP CONSTRAINT "_CostToTotalCostFixed_A_fkey";

-- DropForeignKey
ALTER TABLE "_CostToTotalCostFixed" DROP CONSTRAINT "_CostToTotalCostFixed_B_fkey";

-- DropForeignKey
ALTER TABLE "_CostToTotalCostVariable" DROP CONSTRAINT "_CostToTotalCostVariable_A_fkey";

-- DropForeignKey
ALTER TABLE "_CostToTotalCostVariable" DROP CONSTRAINT "_CostToTotalCostVariable_B_fkey";

-- AlterTable
ALTER TABLE "Cost" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "TotalCostFixed";

-- DropTable
DROP TABLE "TotalCostVariable";

-- DropTable
DROP TABLE "_CostToTotalCostFixed";

-- DropTable
DROP TABLE "_CostToTotalCostVariable";

-- CreateTable
CREATE TABLE "Movement" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" DATE NOT NULL,
    "typeOfMovement" "TypeOfMovement" NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);
