/*
  Warnings:

  - The values [Shares] on the enum `CorporateActionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CorporateActionType_new" AS ENUM ('Bonus', 'RightsSubscribed', 'RightsUnsubscribed', 'Splits', 'ShareBought');
ALTER TABLE "CorporateMaster" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "CorporateMaster" ALTER COLUMN "type" TYPE "CorporateActionType_new" USING ("type"::text::"CorporateActionType_new");
ALTER TYPE "CorporateActionType" RENAME TO "CorporateActionType_old";
ALTER TYPE "CorporateActionType_new" RENAME TO "CorporateActionType";
DROP TYPE "CorporateActionType_old";
ALTER TABLE "CorporateMaster" ALTER COLUMN "type" SET DEFAULT 'Bonus';
COMMIT;
