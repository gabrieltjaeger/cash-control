-- DropForeignKey
ALTER TABLE "associates" DROP CONSTRAINT "associates_addressId_fkey";

-- AlterTable
ALTER TABLE "associates" ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "associates" ADD CONSTRAINT "associates_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
