CREATE TABLE "CmvPlanning" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "plannedAmount" DOUBLE PRECISION NOT NULL,
    "unitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmvPlanning_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CmvPlanning_unitId_year_month_key"
ON "CmvPlanning"("unitId", "year", "month");

CREATE INDEX "CmvPlanning_unitId_year_idx"
ON "CmvPlanning"("unitId", "year");

ALTER TABLE "CmvPlanning"
ADD CONSTRAINT "CmvPlanning_unitId_fkey"
FOREIGN KEY ("unitId") REFERENCES "StoreUnit"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
