

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "acess_level",
ADD COLUMN     "access_level" VARCHAR(100) NOT NULL;

-- RenameEnum
ALTER TYPE "AcessLevel" RENAME TO "AccessLevel";

-- RenameColumn
ALTER TABLE "User" RENAME COLUMN "acess_level" TO "access_level";
