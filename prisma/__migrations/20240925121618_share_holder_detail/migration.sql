-- CreateEnum
CREATE TYPE "CaseType" AS ENUM ('ClaimSuspense', 'ClaimSuspenseTransmission', 'ClaimSuspenseTransmissionIssueDuplicate', 'ClaimSuspenseTransmissionIssueDuplicateTransposition', 'Transmission', 'TransmissionIssueDuplicate', 'TransmissionIssueDuplicateTransposition');

-- CreateTable
CREATE TABLE "ShareHolderMaster" (
    "id" SERIAL NOT NULL,
    "caseType" "CaseType" NOT NULL DEFAULT 'ClaimSuspense',
    "noOfLegalHeir" VARCHAR(256) NOT NULL,
    "transpositionOrder" TEXT,
    "projectID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareHolderMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareHolderDetail" (
    "id" SERIAL NOT NULL,
    "shareholderName" VARCHAR(256),
    "shareholderNamePan" VARCHAR(256),
    "shareholderNameAadhar" VARCHAR(256),
    "shareholderNameAadharCertificate" VARCHAR(256),
    "shareholderNameAadharCml" VARCHAR(256),
    "namePan" VARCHAR(256),
    "nameAadhar" VARCHAR(256),
    "nameCml" VARCHAR(256),
    "phone" VARCHAR(256),
    "email" VARCHAR(256),
    "aadhar" VARCHAR(256),
    "pan" VARCHAR(256),
    "dob" VARCHAR(256),
    "age" VARCHAR(256),
    "nationality" VARCHAR(256),
    "placeOfBirth" VARCHAR(256),
    "city" VARCHAR(256),
    "state" VARCHAR(256),
    "countryOfBirth" VARCHAR(256),
    "DPID" VARCHAR(256),
    "dematAccountNo" VARCHAR(256),
    "nameBank" VARCHAR(256),
    "bankName" VARCHAR(256),
    "bankAddress" TEXT,
    "bankEmail" VARCHAR(256),
    "bankPhone" VARCHAR(256),
    "bankMICR" VARCHAR(256),
    "bankIFS" VARCHAR(256),
    "bankAccountNo" VARCHAR(256),
    "bankAccountType" VARCHAR(256),
    "addressBank" TEXT,
    "emailBank" VARCHAR(256),
    "phoneBank" VARCHAR(256),
    "pincodeBank" VARCHAR(256),
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

    CONSTRAINT "ShareHolderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "projectID_shareHolderMasterkey" ON "ShareHolderMaster"("projectID");

-- CreateIndex
CREATE INDEX "shareHolderMasterID_shareHolderDetailkey" ON "ShareHolderDetail"("shareHolderMasterID");

-- AddForeignKey
ALTER TABLE "ShareHolderMaster" ADD CONSTRAINT "ShareHolderMaster_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "ShareHolderDetail" ADD CONSTRAINT "ShareHolderDetail_shareHolderMasterID_fkey" FOREIGN KEY ("shareHolderMasterID") REFERENCES "ShareHolderMaster"("id") ON DELETE SET NULL ON UPDATE SET NULL;
