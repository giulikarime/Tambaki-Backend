-- CreateTable
CREATE TABLE "TotalCostVariable" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TotalCostVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotalCostFixed" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TotalCostFixed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CostToTotalCostVariable" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CostToTotalCostVariable_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CostToTotalCostFixed" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CostToTotalCostFixed_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CostToTotalCostVariable_B_index" ON "_CostToTotalCostVariable"("B");

-- CreateIndex
CREATE INDEX "_CostToTotalCostFixed_B_index" ON "_CostToTotalCostFixed"("B");

-- AddForeignKey
ALTER TABLE "_CostToTotalCostVariable" ADD CONSTRAINT "_CostToTotalCostVariable_A_fkey" FOREIGN KEY ("A") REFERENCES "Cost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostToTotalCostVariable" ADD CONSTRAINT "_CostToTotalCostVariable_B_fkey" FOREIGN KEY ("B") REFERENCES "TotalCostVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostToTotalCostFixed" ADD CONSTRAINT "_CostToTotalCostFixed_A_fkey" FOREIGN KEY ("A") REFERENCES "Cost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostToTotalCostFixed" ADD CONSTRAINT "_CostToTotalCostFixed_B_fkey" FOREIGN KEY ("B") REFERENCES "TotalCostFixed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
