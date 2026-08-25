/*
  Warnings:

  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Aberta', 'Fechada', 'Paga');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('Pendente', 'Confirmada', 'Cancelada', 'Concluida', 'NoShow');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_menuId_fkey";

-- DropIndex
DROP INDEX "Order_tableId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "quantity",
ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'Aberta',
ALTER COLUMN "total_value" SET DEFAULT 0,
ALTER COLUMN "menuId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "orderId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "quantityPeople" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'Pendente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tableId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reservation_tableId_startsAt_endsAt_idx" ON "Reservation"("tableId", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Reservation_unitId_startsAt_idx" ON "Reservation"("unitId", "startsAt");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "StoreUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
