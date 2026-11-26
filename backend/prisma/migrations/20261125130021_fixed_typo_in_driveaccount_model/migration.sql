/*
  Warnings:

  - You are about to drop the column `quotaused` on the `driveAccounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "driveAccounts" DROP COLUMN "quotaused",
ADD COLUMN     "quotaUsed" BIGINT;
