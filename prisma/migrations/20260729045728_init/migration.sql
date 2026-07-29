/*
  Warnings:

  - The values [TRANSPORTATION] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('RENT', 'UTILITIES', 'SUBSCRIPTION', 'CLOTHING', 'GROCERIES', 'GYM', 'ELECTRONICS', 'ENTERTAINMENT', 'MEDICAL', 'GIFTS', 'GOING_OUT', 'PUBLIC_TRANSPORTATION', 'TRAVEL', 'BILLS', 'RESTAURANT', 'SHOPPING', 'OTHER');
ALTER TABLE "Transaction" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TABLE "Budget" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;
