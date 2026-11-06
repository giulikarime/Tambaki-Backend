/*
  Warnings:

  - The values [fixo,variavel] on the enum `costType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "costType_new" AS ENUM ('Fixo', 'Variavel');
ALTER TABLE "Cost" ALTER COLUMN "costType" TYPE "costType_new" USING ("costType"::text::"costType_new");
ALTER TYPE "costType" RENAME TO "costType_old";
ALTER TYPE "costType_new" RENAME TO "costType";
DROP TYPE "public"."costType_old";
COMMIT;
