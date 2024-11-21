/*
  Warnings:

  - The values [ClaimSuspense,ClaimSuspenseTransmission,ClaimSuspenseTransmissionIssueDuplicate,ClaimSuspenseTransmissionIssueDuplicateTransposition] on the enum `CaseType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `annualIncomeClaimant` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfDocument` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `deceasedRelationship` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `dobMinor` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `dod` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `guardianName` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `guardianPan` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `guardianRelationship` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `isDeceased` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `isMinor` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `isTestate` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `occupationClaimant` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `percentageClaimant` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `politicalExposureClaimant` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfSucession` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `selectClaimant` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderNameAadhar` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderNameCml` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderNameDeath` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderNamePan` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `statusClaimant` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `taxStatus` on the `ShareHolderDetail` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CaseType_new" AS ENUM ('Claim', 'ClaimTransposition', 'ClaimIssueDuplicate', 'Transmission', 'TransmissionIssueDuplicate', 'TransmissionIssueDuplicateTransposition', 'Deletion', 'DeletionIssueDuplicate', 'DeletionIssueDuplicateTransposition');
ALTER TABLE "ShareHolderMaster" ALTER COLUMN "caseType" DROP DEFAULT;
ALTER TABLE "ShareHolderMaster" ALTER COLUMN "caseType" TYPE "CaseType_new" USING ("caseType"::text::"CaseType_new");
ALTER TYPE "CaseType" RENAME TO "CaseType_old";
ALTER TYPE "CaseType_new" RENAME TO "CaseType";
DROP TYPE "CaseType_old";
ALTER TABLE "ShareHolderMaster" ALTER COLUMN "caseType" SET DEFAULT 'Claim';
COMMIT;

-- AlterTable
ALTER TABLE "ShareHolderDetail" DROP COLUMN "annualIncomeClaimant",
DROP COLUMN "dateOfDocument",
DROP COLUMN "deceasedRelationship",
DROP COLUMN "dobMinor",
DROP COLUMN "document",
DROP COLUMN "dod",
DROP COLUMN "guardianName",
DROP COLUMN "guardianPan",
DROP COLUMN "guardianRelationship",
DROP COLUMN "isDeceased",
DROP COLUMN "isMinor",
DROP COLUMN "isTestate",
DROP COLUMN "occupationClaimant",
DROP COLUMN "percentageClaimant",
DROP COLUMN "politicalExposureClaimant",
DROP COLUMN "proofOfSucession",
DROP COLUMN "selectClaimant",
DROP COLUMN "shareholderNameAadhar",
DROP COLUMN "shareholderNameCml",
DROP COLUMN "shareholderNameDeath",
DROP COLUMN "shareholderNamePan",
DROP COLUMN "statusClaimant",
DROP COLUMN "taxStatus";

-- AlterTable
ALTER TABLE "ShareHolderMaster" ALTER COLUMN "caseType" SET DEFAULT 'Claim';

-- CreateTable
CREATE TABLE "LegalHeirDetail" (
    "id" SERIAL NOT NULL,
    "isDeceased" "TruthType" NOT NULL DEFAULT 'No',
    "shareholderNameDeath" VARCHAR(256),
    "dod" VARCHAR(256),
    "isTestate" "TruthType" NOT NULL DEFAULT 'No',
    "proofOfSucession" "TruthType" NOT NULL DEFAULT 'No',
    "document" TEXT,
    "dateOfDocument" VARCHAR(256),
    "isMinor" "TruthType" NOT NULL DEFAULT 'No',
    "dobMinor" VARCHAR(256),
    "guardianName" VARCHAR(256),
    "guardianRelationship" VARCHAR(256),
    "guardianPan" VARCHAR(256),
    "deceasedRelationship" VARCHAR(256),
    "taxStatus" VARCHAR(256),
    "selectClaimant" VARCHAR(256),
    "statusClaimant" VARCHAR(256),
    "percentageClaimant" VARCHAR(256),
    "occupationClaimant" VARCHAR(256),
    "politicalExposureClaimant" VARCHAR(256),
    "annualIncomeClaimant" VARCHAR(256),
    "shareHolderMasterID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalHeirDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shareHolderMasterID_legalHeirDetailkey" ON "LegalHeirDetail"("shareHolderMasterID");

-- AddForeignKey
ALTER TABLE "LegalHeirDetail" ADD CONSTRAINT "LegalHeirDetail_shareHolderMasterID_fkey" FOREIGN KEY ("shareHolderMasterID") REFERENCES "ShareHolderMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;
