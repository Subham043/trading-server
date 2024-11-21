-- CreateEnum
CREATE TYPE "IntrumentType" AS ENUM ('InvIT', 'IDR', 'MFs', 'PreferenceShares', 'REiT', 'Equity', 'Warrant');

-- CreateTable
CREATE TABLE "SecurityTypeMaster" (
    "id" SERIAL NOT NULL,
    "instrumentType" "IntrumentType" NOT NULL DEFAULT 'InvIT',
    "Symbol" VARCHAR(256),
    "Series" VARCHAR(256),
    "securityName" VARCHAR(256),
    "dateOfListing" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfAllotment" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redemptionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidUpValue" DOUBLE PRECISION DEFAULT 0.0,
    "faceValue" DOUBLE PRECISION DEFAULT 0.0,
    "dividend" DOUBLE PRECISION DEFAULT 0.0,
    "redemptionAmount" DOUBLE PRECISION DEFAULT 0.0,
    "conversionAmount" DOUBLE PRECISION DEFAULT 0.0,
    "marketLot" VARCHAR(256),
    "isinNumber" VARCHAR(256),
    "distinctiveNosFrom" VARCHAR(256),
    "distinctiveNosTo" VARCHAR(256),
    "companyID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companyID_securityTypeMasterkey" ON "SecurityTypeMaster"("companyID");

-- AddForeignKey
ALTER TABLE "SecurityTypeMaster" ADD CONSTRAINT "SecurityTypeMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE SET NULL ON UPDATE SET NULL;
