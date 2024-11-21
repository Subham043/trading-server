-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "allowAffidavit" "TruthType" NOT NULL DEFAULT 'No',
ADD COLUMN     "deadShareholderID" INTEGER,
ADD COLUMN     "placeOfDeath" VARCHAR(256),
ADD COLUMN     "selectAffidavit" VARCHAR(256);

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_deadShareholderID_fkey" FOREIGN KEY ("deadShareholderID") REFERENCES "ShareHolderDetail"("id") ON DELETE CASCADE ON UPDATE SET NULL;
