ALTER TABLE "Client"
ADD COLUMN "resetTokenHash" VARCHAR(64),
ADD COLUMN "resetTokenExpires" TIMESTAMP(3);

CREATE UNIQUE INDEX "Client_resetTokenHash_key" ON "Client"("resetTokenHash");

ALTER TABLE "User"
ADD COLUMN "resetTokenHash" VARCHAR(64),
ADD COLUMN "resetTokenExpires" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_resetTokenHash_key" ON "User"("resetTokenHash");
