-- CreateEnum
CREATE TYPE "costCategory" AS ENUM ('Aluguel', 'Salários_Equipe', 'Pró_Labore_Sócios', 'Contas_Consumo', 'Sistema_PDV_ERP', 'Contador', 'Insumos_Ingredientes', 'Impostos_Vendas', 'Taxas_Maquininhas_Cartão', 'Comissões_Apps_Delivery', 'Embalagens');

-- CreateEnum
CREATE TYPE "costType" AS ENUM ('fixo', 'variavel');

-- CreateTable
CREATE TABLE "Cost" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "costCategory" "costCategory" NOT NULL,
    "costType" "costType" NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);
