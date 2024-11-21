-- CreateTable
CREATE TABLE "DividendMaster" (
    "id" SERIAL NOT NULL,
    "recorded_date" VARCHAR(256) NOT NULL,
    "financial_year" VARCHAR(256),
    "dividend_per_share" VARCHAR(256),
    "companyID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DividendMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companyID_dividend_master" ON "DividendMaster"("companyID");

-- AddForeignKey
ALTER TABLE "DividendMaster" ADD CONSTRAINT "DividendMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE SET NULL ON UPDATE SET NULL;
