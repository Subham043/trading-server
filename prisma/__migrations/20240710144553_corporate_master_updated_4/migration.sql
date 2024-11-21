/*
  Warnings:

  - You are about to drop the column `equityType` on the `ShareCertificateMaster` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Folio" ADD COLUMN     "equityType" "EquityType" NOT NULL DEFAULT 'Bonus';

-- AlterTable
ALTER TABLE "ShareCertificateMaster" DROP COLUMN "equityType";
