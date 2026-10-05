/*
  Warnings:

  - The values [Prato] on the enum `MenuCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Allergens" ADD VALUE 'Ovos';
ALTER TYPE "Allergens" ADD VALUE 'Amendoim';
ALTER TYPE "Allergens" ADD VALUE 'Castanhas';
ALTER TYPE "Allergens" ADD VALUE 'Soja';
ALTER TYPE "Allergens" ADD VALUE 'Trigo';
ALTER TYPE "Allergens" ADD VALUE 'Peixes';
ALTER TYPE "Allergens" ADD VALUE 'Crustáceos';
ALTER TYPE "Allergens" ADD VALUE 'Gergelim';

-- AlterEnum
BEGIN;
CREATE TYPE "MenuCategory_new" AS ENUM ('Prato_Principal', 'Entrada', 'Saída', 'Rodizio', 'LaCarte', 'SelfService', 'Vegetariano', 'Vegano', 'Sobremesa', 'Bebidas');
ALTER TABLE "Menu" ALTER COLUMN "category" TYPE "MenuCategory_new" USING ("category"::text::"MenuCategory_new");
ALTER TYPE "MenuCategory" RENAME TO "MenuCategory_old";
ALTER TYPE "MenuCategory_new" RENAME TO "MenuCategory";
DROP TYPE "public"."MenuCategory_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductsCategory" ADD VALUE 'Panificação';
ALTER TYPE "ProductsCategory" ADD VALUE 'Congelados';
ALTER TYPE "ProductsCategory" ADD VALUE 'Materiais_Operacionais';
ALTER TYPE "ProductsCategory" ADD VALUE 'Descartáveis';
