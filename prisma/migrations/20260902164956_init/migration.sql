/*
  Warnings:

  - The values [CamaraFria] on the enum `ProductStorageLocation` will be removed. If these variants are still used in the database, this will fail.
  - The values [Carnes,Laticínios,Limpeza] on the enum `ProductsCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductStorageLocation_new" AS ENUM ('Camara_Fria', 'Freezer', 'Geladeira', 'Despensa_EstoqueSeco', 'Bar_Adega', 'Descartaveis', 'Outro');
ALTER TABLE "Product" ALTER COLUMN "storageLocation" TYPE "ProductStorageLocation_new" USING ("storageLocation"::text::"ProductStorageLocation_new");
ALTER TYPE "ProductStorageLocation" RENAME TO "ProductStorageLocation_old";
ALTER TYPE "ProductStorageLocation_new" RENAME TO "ProductStorageLocation";
DROP TYPE "public"."ProductStorageLocation_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductsCategory_new" AS ENUM ('Carnes_e_Pescados', 'Hortifrúti', 'Laticínios_e_Frios', 'Embutidos', 'Secos', 'Bebida_Alcoolica', 'Bebida_nao_Alcoolica');
ALTER TABLE "Product" ALTER COLUMN "category" TYPE "ProductsCategory_new" USING ("category"::text::"ProductsCategory_new");
ALTER TYPE "ProductsCategory" RENAME TO "ProductsCategory_old";
ALTER TYPE "ProductsCategory_new" RENAME TO "ProductsCategory";
DROP TYPE "public"."ProductsCategory_old";
COMMIT;
