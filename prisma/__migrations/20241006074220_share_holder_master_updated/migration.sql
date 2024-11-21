-- AlterTable
ALTER TABLE "ShareHolderMaster" ADD COLUMN     "noOfShareHolder" VARCHAR(256) NOT NULL DEFAULT '0',
ALTER COLUMN "noOfLegalHeir" SET DEFAULT '0';
