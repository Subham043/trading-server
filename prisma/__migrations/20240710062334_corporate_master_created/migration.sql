-- CreateEnum
CREATE TYPE "CorporateActionType" AS ENUM ('Bonus', 'RightsSubscribed', 'RightsUnsubscribed', 'Splits', 'Shares', 'ShareBought');

-- CreateTable
CREATE TABLE "CorporateMaster" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "CorporateActionType" NOT NULL DEFAULT 'Bonus',
    "numerator" VARCHAR(256),
    "denominator" VARCHAR(256),
    "originalHolding" VARCHAR(256),
    "exchange" VARCHAR(256),
    "consolidatedHolding" VARCHAR(256),
    "companyID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CorporateMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companyID_corporate_master" ON "CorporateMaster"("companyID");

-- AddForeignKey
ALTER TABLE "CorporateMaster" ADD CONSTRAINT "CorporateMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE SET NULL ON UPDATE SET NULL;
