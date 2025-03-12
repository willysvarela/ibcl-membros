-- AlterTable
ALTER TABLE "User" ADD COLUMN     "civilStatus" TEXT NOT NULL DEFAULT 'Solteiro',
ADD COLUMN     "engagementDate" TIMESTAMP(3),
ADD COLUMN     "group" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "membershipType" TEXT NOT NULL DEFAULT 'Visitante',
ADD COLUMN     "ministries" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "photo" TEXT NOT NULL DEFAULT '';
