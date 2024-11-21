/*
  Warnings:

  - The values [RightsSubscribed,RightsUnsubscribed] on the enum `CorporateActionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `originalHolding` on the `CorporateMaster` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CorporateActionType_new" AS ENUM ('Equity', 'Bonus', 'Rights', 'Splits', 'ShareBought');
ALTER TABLE "CorporateMaster" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "CorporateMaster" ALTER COLUMN "type" TYPE "CorporateActionType_new" USING ("type"::text::"CorporateActionType_new");
ALTER TYPE "CorporateActionType" RENAME TO "CorporateActionType_old";
ALTER TYPE "CorporateActionType_new" RENAME TO "CorporateActionType";
DROP TYPE "CorporateActionType_old";
ALTER TABLE "CorporateMaster" ALTER COLUMN "type" SET DEFAULT 'Bonus';
COMMIT;

-- AlterTable
ALTER TABLE "CorporateMaster" DROP COLUMN "originalHolding";
