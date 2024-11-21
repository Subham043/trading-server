-- DropIndex
DROP INDEX "companyID_shareCertificateMasterkey";

-- AlterTable
ALTER TABLE "ShareCertificateMaster" ADD COLUMN     "projectID" INTEGER;

-- CreateIndex
CREATE INDEX "companyID_shareCertificateMasterkey" ON "ShareCertificateMaster"("companyID", "projectID");

-- AddForeignKey
ALTER TABLE "ShareCertificateMaster" ADD CONSTRAINT "ShareCertificateMaster_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE SET NULL;
