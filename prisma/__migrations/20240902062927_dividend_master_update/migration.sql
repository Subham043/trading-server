/*
  Warnings:

  - The `recorded_date` column on the `DividendMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DividendMaster" DROP COLUMN "recorded_date",
ADD COLUMN     "recorded_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
