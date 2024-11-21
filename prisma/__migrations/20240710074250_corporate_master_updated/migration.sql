/*
  Warnings:

  - You are about to drop the column `consolidatedHolding` on the `CorporateMaster` table. All the data in the column will be lost.
  - You are about to drop the column `exchange` on the `CorporateMaster` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CorporateMaster" DROP COLUMN "consolidatedHolding",
DROP COLUMN "exchange";
