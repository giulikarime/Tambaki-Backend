/*
  Warnings:

  - Added the required column `productId` to the `Cost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitcost` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platePrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TypeOfMovement" ADD VALUE 'Ajuste';

-- AlterTable
ALTER TABLE "Cost" ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "unitcost" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "platePrice" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "_CostToMovement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CostToMovement_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MovementToOrderItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MovementToOrderItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CostToMovement_B_index" ON "_CostToMovement"("B");

-- CreateIndex
CREATE INDEX "_MovementToOrderItem_B_index" ON "_MovementToOrderItem"("B");

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostToMovement" ADD CONSTRAINT "_CostToMovement_A_fkey" FOREIGN KEY ("A") REFERENCES "Cost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostToMovement" ADD CONSTRAINT "_CostToMovement_B_fkey" FOREIGN KEY ("B") REFERENCES "Movement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovementToOrderItem" ADD CONSTRAINT "_MovementToOrderItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Movement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovementToOrderItem" ADD CONSTRAINT "_MovementToOrderItem_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
