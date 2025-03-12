-- First, add the new column 'photo' that will replace 'teenPhoto'
ALTER TABLE "User" ADD COLUMN "photo" TEXT NOT NULL DEFAULT '';

-- Copy data from teenPhoto to photo
UPDATE "User" SET "photo" = "teenPhoto";

-- Add new fields
ALTER TABLE "User" ADD COLUMN "membershipType" TEXT NOT NULL DEFAULT 'Visitante';
ALTER TABLE "User" ADD COLUMN "civilStatus" TEXT NOT NULL DEFAULT 'Solteiro';
ALTER TABLE "User" ADD COLUMN "engagementDate" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "group" TEXT NOT NULL DEFAULT '';
ALTER TABLE "User" ADD COLUMN "ministries" TEXT NOT NULL DEFAULT '';

-- After data migration is complete, we can remove the teenPhoto column in a separate migration
-- This is commented out for now and should be run after verifying the data migration
-- ALTER TABLE "User" DROP COLUMN "teenPhoto"; 