-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'blocked');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "status" "Status" NOT NULL DEFAULT 'active',
    "key" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pincode" (
    "id" SERIAL NOT NULL,
    "circle_name" VARCHAR(256) NOT NULL,
    "region_name" VARCHAR(256) NOT NULL,
    "division_name" VARCHAR(256) NOT NULL,
    "office_name" VARCHAR(256) NOT NULL,
    "pincode" VARCHAR(256) NOT NULL,
    "office_type" VARCHAR(256) NOT NULL,
    "district" VARCHAR(256) NOT NULL,
    "state_name" VARCHAR(256) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pincode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FailedExcel" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_of" VARCHAR(256) NOT NULL,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FailedExcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrarMaster" (
    "id" SERIAL NOT NULL,
    "registrar_name" VARCHAR(256) NOT NULL,
    "sebi_regn_id" VARCHAR(256) NOT NULL,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistrarMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrarMasterBranch" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(256),
    "city" VARCHAR(256),
    "state" VARCHAR(256),
    "pincode" VARCHAR(256),
    "telephone1" VARCHAR(256),
    "telephone2" VARCHAR(256),
    "email" VARCHAR(256),
    "website" VARCHAR(256),
    "nameContactPerson" VARCHAR(256),
    "designationContactPerson" VARCHAR(256),
    "emailContactPerson" VARCHAR(256),
    "phoneContactPerson" VARCHAR(256),
    "officerAssigned" VARCHAR(256),
    "branch" VARCHAR(256),
    "registrarMasterID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistrarMasterBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyMaster" (
    "id" SERIAL NOT NULL,
    "CIN" VARCHAR(256),
    "ISIN" VARCHAR(256),
    "faceValue" DOUBLE PRECISION DEFAULT 0.0,
    "closingPriceNSE" DOUBLE PRECISION DEFAULT 0.0,
    "closingPriceBSE" DOUBLE PRECISION DEFAULT 0.0,
    "registeredOffice" VARCHAR(256),
    "city" VARCHAR(256),
    "state" VARCHAR(256),
    "pincode" VARCHAR(256),
    "telephone" VARCHAR(256),
    "fax" VARCHAR(256),
    "email" VARCHAR(256),
    "website" VARCHAR(256),
    "nameContactPerson" VARCHAR(256),
    "designationContactPerson" VARCHAR(256),
    "emailContactPerson" VARCHAR(256),
    "phoneContactPerson" VARCHAR(256),
    "createdBy" INTEGER,
    "registrarMasterBranchId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NameChangeMaster" (
    "id" SERIAL NOT NULL,
    "NSE" VARCHAR(256),
    "BSE" VARCHAR(256),
    "previousName" VARCHAR(256),
    "currentName" VARCHAR(256),
    "dateNameChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NameChangeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "key_userkey" ON "User"("key");

-- CreateIndex
CREATE UNIQUE INDEX "idx_email_userkey" ON "User"("id", "email");

-- CreateIndex
CREATE INDEX "token_tokenkey" ON "Token"("token");

-- CreateIndex
CREATE INDEX "userId_tokenkey" ON "Token"("userId");

-- CreateIndex
CREATE INDEX "createdBy_failedExcelkey" ON "FailedExcel"("createdBy");

-- CreateIndex
CREATE INDEX "createdBy_registrarMasterkey" ON "RegistrarMaster"("createdBy");

-- CreateIndex
CREATE INDEX "registrarMasterID_registrarMasterBranchkey" ON "RegistrarMasterBranch"("registrarMasterID");

-- CreateIndex
CREATE INDEX "createdBy_companyMasterkey" ON "CompanyMaster"("createdBy");

-- CreateIndex
CREATE INDEX "registrarMasterBranchId_companyMasterkey" ON "CompanyMaster"("registrarMasterBranchId");

-- CreateIndex
CREATE INDEX "companyID_nameChangeMasterkey" ON "NameChangeMaster"("companyID");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "FailedExcel" ADD CONSTRAINT "FailedExcel_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "RegistrarMaster" ADD CONSTRAINT "RegistrarMaster_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "RegistrarMasterBranch" ADD CONSTRAINT "RegistrarMasterBranch_registrarMasterID_fkey" FOREIGN KEY ("registrarMasterID") REFERENCES "RegistrarMaster"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "CompanyMaster" ADD CONSTRAINT "CompanyMaster_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "CompanyMaster" ADD CONSTRAINT "CompanyMaster_registrarMasterBranchId_fkey" FOREIGN KEY ("registrarMasterBranchId") REFERENCES "RegistrarMasterBranch"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "NameChangeMaster" ADD CONSTRAINT "NameChangeMaster_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyMaster"("id") ON DELETE SET NULL ON UPDATE SET NULL;
