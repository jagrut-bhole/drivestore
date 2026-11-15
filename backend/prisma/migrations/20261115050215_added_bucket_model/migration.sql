/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Bucket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[keyHash]` on the table `apiKeys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `driveAccountId` to the `Bucket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driveFolderId` to the `Bucket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Bucket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Bucket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApiKeyPermission" AS ENUM ('READ', 'WRITE', 'DELETE');

-- AlterTable
ALTER TABLE "Bucket" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "driveAccountId" UUID NOT NULL,
ADD COLUMN     "driveFolderId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "apiKeys" ADD COLUMN     "permissions" "ApiKeyPermission"[];

-- DropEnum
DROP TYPE "UploadStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Bucket_userId_name_key" ON "Bucket"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "apiKeys_keyHash_key" ON "apiKeys"("keyHash");

-- AddForeignKey
ALTER TABLE "Bucket" ADD CONSTRAINT "Bucket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
