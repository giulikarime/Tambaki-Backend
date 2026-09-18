-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_batchId_fkey";
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";
ALTER TABLE "Product" DROP CONSTRAINT "Product_storageLocationId_fkey";

-- AlterTable: drop old columns first (no new columns yet)
ALTER TABLE "Product" DROP COLUMN "allergensText",
DROP COLUMN "allergensType",
DROP COLUMN "batchId",
DROP COLUMN "batchText",
DROP COLUMN "batchType",
DROP COLUMN "brandId",
DROP COLUMN "brandText",
DROP COLUMN "brandType",
DROP COLUMN "categoryId",
DROP COLUMN "categoryText",
DROP COLUMN "categoryType",
DROP COLUMN "storageLocationId",
DROP COLUMN "storageLocationText",
DROP COLUMN "storageLocationType";

-- DropTable (now safe — nothing references these anymore)
DROP TABLE "ProductBatch";
DROP TABLE "ProductBrand";
DROP TABLE "ProductStorageLocation";
DROP TABLE "ProductsCategory";

-- DropEnum
DROP TYPE "ItemType";

-- CreateEnum (now the names are free)
CREATE TYPE "ProductsCategory" AS ENUM ('Carnes_e_Pescados', 'Hortifrúti', 'Laticínios_e_Frios', 'Embutidos', 'Secos', 'Bebida_Alcoolica', 'Bebida_nao_Alcoolica');
CREATE TYPE "ProductStorageLocation" AS ENUM ('Camara_Fria', 'Freezer', 'Geladeira', 'Despensa_Estoque_Seco', 'Bar_Adega', 'Descartaveis');

-- AlterTable: add new columns
ALTER TABLE "Product"
ADD COLUMN     "batch" VARCHAR(30) NOT NULL,
ADD COLUMN     "brand" VARCHAR(150) NOT NULL,
ADD COLUMN     "category" "ProductsCategory" NOT NULL,
ADD COLUMN     "storageLocation" "ProductStorageLocation" NOT NULL;