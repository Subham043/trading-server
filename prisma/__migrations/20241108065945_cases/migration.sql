-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "caseType" "CaseType" NOT NULL DEFAULT 'Claim',
    "folios" TEXT,
    "transpositionOrder" TEXT,
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
    "shareCertificateID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shareCertificateID_casekey" ON "Case"("shareCertificateID");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_shareCertificateID_fkey" FOREIGN KEY ("shareCertificateID") REFERENCES "ShareCertificateMaster"("id") ON DELETE CASCADE ON UPDATE SET NULL;
