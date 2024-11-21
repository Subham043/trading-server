/*
  Warnings:

  - You are about to drop the column `Folio` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `certificateNumber` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `certificateSerialNumber` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfAllotment` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `distinctiveNosFrom` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `distinctiveNosTo` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `faceValue` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `noOfShares` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `noOfSharesWords` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderName1` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderName2` on the `ShareCertificateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `shareholderName3` on the `ShareCertificateMaster` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShareCertificateMaster" DROP COLUMN "Folio",
DROP COLUMN "certificateNumber",
DROP COLUMN "certificateSerialNumber",
DROP COLUMN "dateOfAllotment",
DROP COLUMN "distinctiveNosFrom",
DROP COLUMN "distinctiveNosTo",
DROP COLUMN "faceValue",
DROP COLUMN "noOfShares",
DROP COLUMN "noOfSharesWords",
DROP COLUMN "shareholderName1",
DROP COLUMN "shareholderName2",
DROP COLUMN "shareholderName3";

-- CreateTable
CREATE TABLE "Folio" (
    "id" SERIAL NOT NULL,
    "Folio" VARCHAR(256) NOT NULL,
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
    "shareCertificateID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shareCertificateID_foliokey" ON "Folio"("shareCertificateID");

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_shareCertificateID_fkey" FOREIGN KEY ("shareCertificateID") REFERENCES "ShareCertificateMaster"("id") ON DELETE SET NULL ON UPDATE SET NULL;
