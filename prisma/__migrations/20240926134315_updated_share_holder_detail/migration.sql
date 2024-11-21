/*
  Warnings:

  - You are about to drop the column `shareholderNameAadharCertificate` on the `ShareHolderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderNameAadharCml` on the `ShareHolderDetail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyMaster" DROP CONSTRAINT "CompanyMaster_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "CompanyMaster" DROP CONSTRAINT "CompanyMaster_registrarMasterBranchId_fkey";

-- DropForeignKey
ALTER TABLE "CorporateMaster" DROP CONSTRAINT "CorporateMaster_companyID_fkey";

-- DropForeignKey
ALTER TABLE "DividendMaster" DROP CONSTRAINT "DividendMaster_companyID_fkey";

-- DropForeignKey
ALTER TABLE "FailedExcel" DROP CONSTRAINT "FailedExcel_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Folio" DROP CONSTRAINT "Folio_shareCertificateID_fkey";

-- DropForeignKey
ALTER TABLE "NameChangeMaster" DROP CONSTRAINT "NameChangeMaster_companyID_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userID_fkey";

-- DropForeignKey
ALTER TABLE "RegistrarMaster" DROP CONSTRAINT "RegistrarMaster_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "RegistrarMasterBranch" DROP CONSTRAINT "RegistrarMasterBranch_registrarMasterID_fkey";

-- DropForeignKey
ALTER TABLE "SecurityTypeMaster" DROP CONSTRAINT "SecurityTypeMaster_companyID_fkey";

-- DropForeignKey
ALTER TABLE "ShareCertificateMaster" DROP CONSTRAINT "ShareCertificateMaster_companyID_fkey";

-- DropForeignKey
ALTER TABLE "ShareCertificateMaster" DROP CONSTRAINT "ShareCertificateMaster_projectID_fkey";

-- DropForeignKey
ALTER TABLE "ShareHolderDetail" DROP CONSTRAINT "ShareHolderDetail_shareHolderMasterID_fkey";

-- DropForeignKey
ALTER TABLE "ShareHolderMaster" DROP CONSTRAINT "ShareHolderMaster_projectID_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "ShareHolderDetail" DROP COLUMN "shareholderNameAadharCertificate",
DROP COLUMN "shareholderNameAadharCml",
ADD COLUMN     "shareholderNameCertificate" VARCHAR(256),
ADD COLUMN     "shareholderNameCml" VARCHAR(256);

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "FailedExcel" ADD CONSTRAINT "FailedExcel_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "RegistrarMaster" ADD CONSTRAINT "RegistrarMaster_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "RegistrarMasterBranch" ADD CONSTRAINT "RegistrarMasterBranch_registrarMasterID_fkey" FOREIGN KEY ("registrarMasterID") REFERENCES "RegistrarMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "CompanyMaster" ADD CONSTRAINT "CompanyMaster_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "CompanyMaster" ADD CONSTRAINT "CompanyMaster_registrarMasterBranchId_fkey" FOREIGN KEY ("registrarMasterBranchId") REFERENCES "RegistrarMasterBranch"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "NameChangeMaster" ADD CONSTRAINT "NameChangeMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "SecurityTypeMaster" ADD CONSTRAINT "SecurityTypeMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "ShareCertificateMaster" ADD CONSTRAINT "ShareCertificateMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "ShareCertificateMaster" ADD CONSTRAINT "ShareCertificateMaster_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_shareCertificateID_fkey" FOREIGN KEY ("shareCertificateID") REFERENCES "ShareCertificateMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "CorporateMaster" ADD CONSTRAINT "CorporateMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "DividendMaster" ADD CONSTRAINT "DividendMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "ShareHolderMaster" ADD CONSTRAINT "ShareHolderMaster_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "ShareHolderDetail" ADD CONSTRAINT "ShareHolderDetail_shareHolderMasterID_fkey" FOREIGN KEY ("shareHolderMasterID") REFERENCES "ShareHolderMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;
