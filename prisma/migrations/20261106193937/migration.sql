-- CreateEnum
CREATE TYPE "costCategory" AS ENUM ('Aluguel', 'Salários_Equipe', 'Pró_Labore_Sócios', 'Contas_Consumo', 'Sistema_PDV_ERP', 'Contador', 'Insumos_Ingredientes', 'Impostos_Vendas', 'Taxas_Maquininhas_Cartão', 'Comissões_Apps_Delivery', 'Embalagens');

-- CreateEnum
CREATE TYPE "costType" AS ENUM ('Fixo', 'Variavel');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('Master', 'Senior', 'Pleno', 'Junior');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('Mesa', 'Balcao');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Aberta', 'Fechada', 'Paga');

-- CreateEnum
CREATE TYPE "MenuCategory" AS ENUM ('Prato_Principal', 'Entrada', 'Saída', 'Rodizio', 'LaCarte', 'SelfService', 'Vegetariano', 'Vegano', 'Sobremesa', 'Bebidas');

-- CreateEnum
CREATE TYPE "LeadTimeDays" AS ENUM ('de_1_a_3_Dias', 'de_4_a_6_Dias', 'de_7_a_10_Dias', 'mais_de_10_dias');

-- CreateEnum
CREATE TYPE "EmployType" AS ENUM ('CLT', 'Temporario', 'PJ');

-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('Manha', 'Tarde', 'Noite', 'Full_Time');

-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('Livre', 'Ocupado', 'Reservado');

-- CreateEnum
CREATE TYPE "ProductsCategory" AS ENUM ('Carnes_e_Pescados', 'Hortifrúti', 'Laticínios_e_Frios', 'Embutidos', 'Secos', 'Bebida_Alcoolica', 'Bebida_nao_Alcoolica', 'Panificação', 'Congelados', 'Materiais_Operacionais', 'Descartáveis');

-- CreateEnum
CREATE TYPE "Allergens" AS ENUM ('Laticinios', 'Glúten', 'Oleaginosas', 'Frutos_do_mar', 'Ovos', 'Amendoim', 'Castanhas', 'Soja', 'Trigo', 'Peixes', 'Crustáceos', 'Gergelim');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('kg', 'g', 'mg', 'L', 'mL', 'un', 'cx', 'pct');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('Pendente', 'Confirmada', 'Cancelada', 'Concluida', 'NoShow');

-- CreateEnum
CREATE TYPE "ProductStorageLocation" AS ENUM ('Camara_Fria', 'Freezer', 'Geladeira', 'Despensa_Estoque_Seco', 'Bar_Adega', 'Descartaveis');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('Ativo', 'Inativo', 'Descontinuado');

-- CreateTable
CREATE TABLE "StoreUnit" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "trade_name" VARCHAR(255) NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "adress" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "restaurant" VARCHAR(150) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "access_level" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "role" VARCHAR(150) NOT NULL,
    "access_level" "AccessLevel" NOT NULL,
    "employ_type" "EmployType" NOT NULL,
    "shift" "ShiftType" NOT NULL,
    "hire_date" DATE,
    "weekly_hours" INTEGER,
    "salary" DOUBLE PRECISION,
    "bankName" VARCHAR(150),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "storeUnitId" INTEGER NOT NULL,
    "employe_document" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "trade_name" VARCHAR(255) NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "adress" VARCHAR(255) NOT NULL,
    "category" "ProductsCategory"[],
    "url_document" VARCHAR(255),
    "resposible_name" VARCHAR(255) NOT NULL,
    "lead_time_days" "LeadTimeDays" NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierProducts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "supplierId" INTEGER NOT NULL,

    CONSTRAINT "SupplierProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "cost_price" DOUBLE PRECISION NOT NULL,
    "category" "ProductsCategory" NOT NULL,
    "brand" VARCHAR(150) NOT NULL,
    "allergens" "Allergens"[],
    "stock_quantity" INTEGER NOT NULL,
    "unit_of_product" INTEGER NOT NULL,
    "measure_unit_of_product" "UnitOfMeasure" NOT NULL,
    "unit_of_measure" "UnitOfMeasure" NOT NULL,
    "document_url" VARCHAR(255) NOT NULL,
    "min_stock" INTEGER NOT NULL,
    "max_stock" INTEGER NOT NULL,
    "manufacture_date" DATE NOT NULL,
    "expiration_date" DATE NOT NULL,
    "storageLocation" "ProductStorageLocation" NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "batch" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "category" "MenuCategory" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "img" TEXT[],
    "allergens" "Allergens"[],
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "table_number" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "TableStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "total_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "service_type" "ServiceType" NOT NULL,
    "nameClient" VARCHAR(155) NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "menuId" INTEGER,
    "tableId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "closed_at" TIMESTAMP(3),
    "status" "OrderStatus" NOT NULL DEFAULT 'Aberta',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "orderId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produtoID" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "quantityPeople" INTEGER NOT NULL,
    "startsAtDate" DATE NOT NULL,
    "startsAtHours" TIME NOT NULL,
    "endsAtDate" DATE NOT NULL,
    "endsAtHours" TIME NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'Pendente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tableId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cost" (
    "id" SERIAL NOT NULL,
    "costCategory" "costCategory" NOT NULL,
    "costType" "costType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotalCostVariable" (
    "id" SERIAL NOT NULL,
    "totalVariableCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TotalCostVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotalCostFixed" (
    "id" SERIAL NOT NULL,
    "totalFixedCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TotalCostFixed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenuToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MenuToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CostToTotalCostVariable" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CostToTotalCostVariable_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CostToTotalCostFixed" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CostToTotalCostFixed_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreUnit_company_name_cnpj_key" ON "StoreUnit"("company_name", "cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_cpf_key" ON "User"("email", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_company_name_cnpj_email_key" ON "Supplier"("company_name", "cnpj", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Reservation_tableId_startsAtDate_startsAtHours_idx" ON "Reservation"("tableId", "startsAtDate", "startsAtHours");

-- CreateIndex
CREATE INDEX "Reservation_unitId_endsAtDate_endsAtHours_idx" ON "Reservation"("unitId", "endsAtDate", "endsAtHours");

-- CreateIndex
CREATE INDEX "_MenuToTag_B_index" ON "_MenuToTag"("B");

-- CreateIndex
CREATE INDEX "_CostToTotalCostVariable_B_index" ON "_CostToTotalCostVariable"("B");

-- CreateIndex
CREATE INDEX "_CostToTotalCostFixed_B_index" ON "_CostToTotalCostFixed"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_storeUnitId_fkey" FOREIGN KEY ("storeUnitId") REFERENCES "StoreUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProducts" ADD CONSTRAINT "SupplierProducts_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "StoreUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "StoreUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "StoreUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "StoreUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_produtoID_fkey" FOREIGN KEY ("produtoID") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "StoreUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToTag" ADD CONSTRAINT "_MenuToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToTag" ADD CONSTRAINT "_MenuToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostToTotalCostVariable" ADD CONSTRAINT "_CostToTotalCostVariable_A_fkey" FOREIGN KEY ("A") REFERENCES "Cost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostToTotalCostVariable" ADD CONSTRAINT "_CostToTotalCostVariable_B_fkey" FOREIGN KEY ("B") REFERENCES "TotalCostVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostToTotalCostFixed" ADD CONSTRAINT "_CostToTotalCostFixed_A_fkey" FOREIGN KEY ("A") REFERENCES "Cost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostToTotalCostFixed" ADD CONSTRAINT "_CostToTotalCostFixed_B_fkey" FOREIGN KEY ("B") REFERENCES "TotalCostFixed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
