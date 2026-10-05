/*
  Warnings:
  - You are about to drop the column `available` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `current_stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `endsAt` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Reservation` table. All the data in the column will be lost.
*/

-- 1. Remover índices antigos primeiro
DROP INDEX IF EXISTS "Reservation_tableId_startsAt_endsAt_idx";
DROP INDEX IF EXISTS "Reservation_tableId_startsAt_idx";
DROP INDEX IF EXISTS "Reservation_unitId_startsAt_idx";

-- 2. Ajustes simples de tipo de dados (Client, EmployeDocument, User)
ALTER TABLE "Client" ALTER COLUMN "createDate" SET DATA TYPE TIMESTAMP(3);
ALTER TABLE "EmployeDocument" ALTER COLUMN "issuedAt" SET DATA TYPE DATE, ALTER COLUMN "valid_until" SET DATA TYPE DATE;
ALTER TABLE "User" ALTER COLUMN "hire_date" SET DATA TYPE DATE;

-- 3. Correção da tabela Product (Removendo colunas antigas e alterando unit_of_measure com segurança)
ALTER TABLE "Product" DROP COLUMN "available", DROP COLUMN "current_stock";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "unit_of_measure";
ALTER TABLE "Product" ADD COLUMN "unit_of_measure" "UnitOfMeasure" NOT NULL;

-- 4. CORREÇÃO DA RESERVATION: Criar novas colunas como opcionais (NULL) primeiro
ALTER TABLE "Reservation" 
ADD COLUMN "endsAtDate" DATE,
ADD COLUMN "endsAtHours" TIME,
ADD COLUMN "startsAtDate" DATE,
ADD COLUMN "startsAtHours" TIME;

-- 5. CORREÇÃO DA RESERVATION: Copiar e converter os dados antigos para as novas colunas
UPDATE "Reservation"
SET 
  "endsAtDate" = "endsAt"::DATE,
  "endsAtHours" = "endsAt"::TIME,
  "startsAtDate" = "startsAt"::DATE,
  "startsAtHours" = "startsAt"::TIME;

-- 6. CORREÇÃO DA RESERVATION: Agora sim, aplicar o NOT NULL nelas
ALTER TABLE "Reservation" 
ALTER COLUMN "endsAtDate" SET NOT NULL,
ALTER COLUMN "endsAtHours" SET NOT NULL,
ALTER COLUMN "startsAtDate" SET NOT NULL,
ALTER COLUMN "startsAtHours" SET NOT NULL;

-- 7. CORREÇÃO DA RESERVATION: Deletar as colunas antigas com segurança
ALTER TABLE "Reservation" 
DROP COLUMN "endsAt",
DROP COLUMN "startsAt";

-- 8. Criar os novos índices necessários
CREATE INDEX "Reservation_tableId_startsAtDate_startsAtHours_idx" ON "Reservation"("tableId", "startsAtDate", "startsAtHours");
CREATE INDEX "Reservation_unitId_endsAtDate_endsAtHours_idx" ON "Reservation"("unitId", "endsAtDate", "endsAtHours");
