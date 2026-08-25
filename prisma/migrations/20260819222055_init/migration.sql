-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE VARCHAR(60);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "restaurant" VARCHAR(150) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "acess_level" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
