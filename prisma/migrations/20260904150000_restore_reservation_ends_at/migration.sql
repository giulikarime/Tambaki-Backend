ALTER TABLE "Reservation" ADD COLUMN "endsAt" TIMESTAMP(3);

UPDATE "Reservation" SET "endsAt" = "startsAt";

ALTER TABLE "Reservation" ALTER COLUMN "endsAt" SET NOT NULL;

CREATE INDEX "Reservation_tableId_startsAt_endsAt_idx" ON "Reservation"("tableId", "startsAt", "endsAt");