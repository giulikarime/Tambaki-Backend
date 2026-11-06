-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadTimeDays') THEN
    CREATE TYPE "LeadTimeDays" AS ENUM ('de_1_a_3_Dias', 'de_4_a_6_Dias', 'de_7_a_10_Dias', 'mais_de_10_dias');
  END IF;
END$$;

-- DropForeignKey defensivo (impede erro 42P01 se a tabela não existir)
ALTER TABLE IF EXISTS "_CostToTotalCostFixed" DROP CONSTRAINT IF EXISTS "_CostToTotalCostFixed_A_fkey";
ALTER TABLE IF EXISTS "_CostToTotalCostFixed" DROP CONSTRAINT IF EXISTS "_CostToTotalCostFixed_B_fkey";
ALTER TABLE IF EXISTS "_CostToTotalCostVariable" DROP CONSTRAINT IF EXISTS "_CostToTotalCostVariable_A_fkey";
ALTER TABLE IF EXISTS "_CostToTotalCostVariable" DROP CONSTRAINT IF EXISTS "_CostToTotalCostVariable_B_fkey";

-- Primary key defensiva
ALTER TABLE IF EXISTS "_CostToTotalCostFixed" DROP CONSTRAINT IF EXISTS "_CostToTotalCostFixed_AB_pkey";

-- DropTable defensivo
DROP TABLE IF EXISTS "TotalCostFixed";
DROP TABLE IF EXISTS "TotalCostVariable";
DROP TABLE IF EXISTS "_CostToTotalCostFixed";
DROP TABLE IF EXISTS "_CostToTotalCostVariable";

-- AlterTable na Supplier
ALTER TABLE "Supplier" DROP COLUMN IF EXISTS "lead_time_days";
ALTER TABLE "Supplier" ADD COLUMN "lead_time_days" "LeadTimeDays" NOT NULL;