/*
  Warnings:

  - You are about to drop the column `shareholderName1` on the `Folio` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderName2` on the `Folio` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderName3` on the `Folio` table. All the data in the column will be lost.
  - You are about to drop the column `annualIncomeClaimant` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfDocument` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `deceasedRelationship` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `dobMinor` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `dod` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `guardianName` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `guardianPan` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `guardianRelationship` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `isDeceased` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `isMinor` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `isTestate` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `occupationClaimant` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `percentageClaimant` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `politicalExposureClaimant` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfSucession` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `selectClaimant` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `shareHolderMasterID` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderNameDeath` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `statusClaimant` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `taxStatus` on the `LegalHeirDetail` table. All the data in the column will be lost.
  - You are about to drop the column `endorsement` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `endorsementDate` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `endorsementFolio` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `endorsementShareholderName1` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `endorsementShareholderName2` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `endorsementShareholderName3` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `shareHolderMasterID` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the `ShareHolderMaster` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LegalHeirDetail" DROP CONSTRAINT "LegalHeirDetail_shareHolderMasterID_fkey";

-- DropForeignKey
ALTER TABLE "ShareHolderDetail" DROP CONSTRAINT "ShareHolderDetail_shareHolderMasterID_fkey";

-- DropForeignKey
ALTER TABLE "ShareHolderMaster" DROP CONSTRAINT "ShareHolderMaster_projectID_fkey";

-- DropIndex
DROP INDEX "shareHolderMasterID_legalHeirDetailkey";

-- DropIndex
DROP INDEX "shareHolderMasterID_shareHolderDetailkey";

-- AlterTable
ALTER TABLE "Folio" DROP COLUMN "shareholderName1",
DROP COLUMN "shareholderName2",
DROP COLUMN "shareholderName3",
ADD COLUMN     "endorsement" "TruthType" NOT NULL DEFAULT 'No',
ADD COLUMN     "endorsementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endorsementFolio" VARCHAR(256),
ADD COLUMN     "endorsementShareholderName1ID" INTEGER,
ADD COLUMN     "endorsementShareholderName2ID" INTEGER,
ADD COLUMN     "endorsementShareholderName3ID" INTEGER,
ADD COLUMN     "shareholderName1ID" INTEGER,
ADD COLUMN     "shareholderName2ID" INTEGER,
ADD COLUMN     "shareholderName3ID" INTEGER;

-- AlterTable
ALTER TABLE "LegalHeirDetail" DROP COLUMN "annualIncomeClaimant",
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
DROP COLUMN "shareHolderMasterID",
DROP COLUMN "shareholderNameDeath",
DROP COLUMN "statusClaimant",
DROP COLUMN "taxStatus",
ADD COLUMN     "DPID" VARCHAR(256),
ADD COLUMN     "aadhar" VARCHAR(256),
ADD COLUMN     "accountOpeningDate" VARCHAR(256),
ADD COLUMN     "addressBank" TEXT,
ADD COLUMN     "age" VARCHAR(256),
ADD COLUMN     "bankAccountNo" VARCHAR(256),
ADD COLUMN     "bankAccountType" VARCHAR(256),
ADD COLUMN     "bankAddress" TEXT,
ADD COLUMN     "bankEmail" VARCHAR(256),
ADD COLUMN     "bankIFS" VARCHAR(256),
ADD COLUMN     "bankMICR" VARCHAR(256),
ADD COLUMN     "bankName" VARCHAR(256),
ADD COLUMN     "bankPhone" VARCHAR(256),
ADD COLUMN     "branchName" VARCHAR(256),
ADD COLUMN     "city" VARCHAR(256),
ADD COLUMN     "countryOfBirth" VARCHAR(256),
ADD COLUMN     "dematAccountNo" VARCHAR(256),
ADD COLUMN     "dob" VARCHAR(256),
ADD COLUMN     "email" VARCHAR(256),
ADD COLUMN     "emailBank" VARCHAR(256),
ADD COLUMN     "husbandName" VARCHAR(256),
ADD COLUMN     "nameAadhar" VARCHAR(256),
ADD COLUMN     "nameBank" VARCHAR(256),
ADD COLUMN     "nameCml" VARCHAR(256),
ADD COLUMN     "namePan" VARCHAR(256),
ADD COLUMN     "nationality" VARCHAR(256),
ADD COLUMN     "occupation" VARCHAR(256),
ADD COLUMN     "pan" VARCHAR(256),
ADD COLUMN     "phone" VARCHAR(256),
ADD COLUMN     "phoneBank" VARCHAR(256),
ADD COLUMN     "pincodeBank" VARCHAR(256),
ADD COLUMN     "placeOfBirth" VARCHAR(256),
ADD COLUMN     "projectID" INTEGER,
ADD COLUMN     "state" VARCHAR(256);

-- AlterTable
ALTER TABLE "ShareCertificateMaster" DROP COLUMN "endorsement",
DROP COLUMN "endorsementDate",
DROP COLUMN "endorsementFolio",
DROP COLUMN "endorsementShareholderName1",
DROP COLUMN "endorsementShareholderName2",
DROP COLUMN "endorsementShareholderName3";

-- AlterTable
ALTER TABLE "ShareHolderDetail" DROP COLUMN "shareHolderMasterID",
ADD COLUMN     "accountOpeningDate" VARCHAR(256),
ADD COLUMN     "branchName" VARCHAR(256),
ADD COLUMN     "husbandName" VARCHAR(256),
ADD COLUMN     "occupation" VARCHAR(256),
ADD COLUMN     "projectID" INTEGER;

-- DropTable
DROP TABLE "ShareHolderMaster";

-- CreateIndex
CREATE INDEX "projectID_legalHeirDetailkey" ON "LegalHeirDetail"("projectID");

-- CreateIndex
CREATE INDEX "projectID_shareHolderDetailkey" ON "ShareHolderDetail"("projectID");

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_shareholderName1ID_fkey" FOREIGN KEY ("shareholderName1ID") REFERENCES "ShareHolderDetail"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_shareholderName2ID_fkey" FOREIGN KEY ("shareholderName2ID") REFERENCES "ShareHolderDetail"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_shareholderName3ID_fkey" FOREIGN KEY ("shareholderName3ID") REFERENCES "ShareHolderDetail"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_endorsementShareholderName1ID_fkey" FOREIGN KEY ("endorsementShareholderName1ID") REFERENCES "ShareHolderDetail"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_endorsementShareholderName2ID_fkey" FOREIGN KEY ("endorsementShareholderName2ID") REFERENCES "ShareHolderDetail"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_endorsementShareholderName3ID_fkey" FOREIGN KEY ("endorsementShareholderName3ID") REFERENCES "ShareHolderDetail"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "ShareHolderDetail" ADD CONSTRAINT "ShareHolderDetail_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "LegalHeirDetail" ADD CONSTRAINT "LegalHeirDetail_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE SET NULL;
