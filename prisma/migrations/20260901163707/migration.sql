/*
  Warnings:

  - The values [Glúten] on the enum `Allergens` will be removed. If these variants are still used in the database, this will fail.
  - The values [Hortifrúti,Laticínios] on the enum `ProductsCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Allergens_new" AS ENUM ('Laticinios', 'Oleaginosas', 'Frutos_do_mar');
ALTER TABLE "Product" ALTER COLUMN "allergens" TYPE "Allergens_new"[] USING ("allergens"::text::"Allergens_new"[]);
ALTER TYPE "Allergens" RENAME TO "Allergens_old";
ALTER TYPE "Allergens_new" RENAME TO "Allergens";
DROP TYPE "public"."Allergens_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductsCategory_new" AS ENUM ('Carnes', 'Embutidos', 'Secos', 'Limpeza');
ALTER TABLE "Product" ALTER COLUMN "category" TYPE "ProductsCategory_new" USING ("category"::text::"ProductsCategory_new");
ALTER TYPE "ProductsCategory" RENAME TO "ProductsCategory_old";
ALTER TYPE "ProductsCategory_new" RENAME TO "ProductsCategory";
DROP TYPE "public"."ProductsCategory_old";
COMMIT;
