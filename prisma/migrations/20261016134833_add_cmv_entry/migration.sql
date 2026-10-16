-- CreateEnum
CREATE TYPE "CmvEntryType" AS ENUM ('Produto', 'Frete', 'Imposto_Insumo', 'Conservacao', 'Embalagem');

-- CreateTable
CREATE TABLE "CmvEntry" (
    "id" SERIAL NOT NULL,
    "type" "CmvEntryType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION,
    "description" VARCHAR(255),
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "CmvEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CmvEntry_unitId_date_idx" ON "CmvEntry"("unitId", "date");

-- AddForeignKey
ALTER TABLE "CmvEntry" ADD CONSTRAINT "CmvEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmvEntry" ADD CONSTRAINT "CmvEntry_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "StoreUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
