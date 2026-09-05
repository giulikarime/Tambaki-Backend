/*
  Warnings:

  - The values [Despensa_EstoqueSeco] on the enum `ProductStorageLocation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductStorageLocation_new" AS ENUM ('Camara_Fria', 'Freezer', 'Geladeira', 'Despensa_Estoque_Seco', 'Bar_Adega', 'Descartaveis');
ALTER TABLE "Product" ALTER COLUMN "storageLocation" TYPE "ProductStorageLocation_new" USING ("storageLocation"::text::"ProductStorageLocation_new");
ALTER TYPE "ProductStorageLocation" RENAME TO "ProductStorageLocation_old";
ALTER TYPE "ProductStorageLocation_new" RENAME TO "ProductStorageLocation";
DROP TYPE "public"."ProductStorageLocation_old";
COMMIT;
