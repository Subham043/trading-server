/*
  Warnings:

  - You are about to drop the `SecurityMaster` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SecurityMaster" DROP CONSTRAINT "SecurityMaster_companyID_fkey";

-- DropTable
DROP TABLE "SecurityMaster";

-- CreateTable
CREATE TABLE "ShareCertificateMaster" (
    "id" SERIAL NOT NULL,
    "instrumentType" "IntrumentType" NOT NULL DEFAULT 'InvIT',
    "equityType" "EquityType" NOT NULL DEFAULT 'Bonus',
    "Folio" VARCHAR(256),
    "certificateNumber" VARCHAR(256),
    "certificateSerialNumber" VARCHAR(256),
    "shareholderName1" VARCHAR(256),
    "shareholderName2" VARCHAR(256),
    "shareholderName3" VARCHAR(256),
    "noOfShares" VARCHAR(256),
    "noOfSharesWords" VARCHAR(256),
    "dateOfAllotment" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "faceValue" DOUBLE PRECISION DEFAULT 0.0,
    "distinctiveNosFrom" VARCHAR(256),
    "distinctiveNosTo" VARCHAR(256),
    "endorsement" "TruthType" NOT NULL DEFAULT 'No',
    "endorsementFolio" VARCHAR(256),
    "endorsementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endorsementShareholderName1" VARCHAR(256),
    "endorsementShareholderName2" VARCHAR(256),
    "endorsementShareholderName3" VARCHAR(256),
    "companyID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareCertificateMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companyID_shareCertificateMasterkey" ON "ShareCertificateMaster"("companyID");

-- AddForeignKey
ALTER TABLE "ShareCertificateMaster" ADD CONSTRAINT "ShareCertificateMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE SET NULL ON UPDATE SET NULL;
