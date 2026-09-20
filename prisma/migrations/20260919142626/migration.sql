/*
  Warnings:

  - The values [Nenhum] on the enum `Allergens` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Allergens_new" AS ENUM ('Laticinios', 'Glúten', 'Oleaginosas', 'Frutos_do_mar', 'Ovos', 'Amendoim', 'Castanhas', 'Soja', 'Trigo', 'Peixes', 'Crustáceos', 'Gergelim');
ALTER TABLE "Product" ALTER COLUMN "allergens" TYPE "Allergens_new" USING ("allergens"::text::"Allergens_new");
ALTER TYPE "Allergens" RENAME TO "Allergens_old";
ALTER TYPE "Allergens_new" RENAME TO "Allergens";
DROP TYPE "public"."Allergens_old";
COMMIT;
