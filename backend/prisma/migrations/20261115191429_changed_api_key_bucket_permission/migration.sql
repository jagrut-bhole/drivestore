-- DropForeignKey
ALTER TABLE "apiKeys" DROP CONSTRAINT "apiKeys_bucketId_fkey";

-- AlterTable
ALTER TABLE "apiKeys" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ALTER COLUMN "bucketId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "apiKeys_bucketId_idx" ON "apiKeys"("bucketId");

-- CreateIndex
CREATE INDEX "apiKeys_expiresAt_idx" ON "apiKeys"("expiresAt");

-- AddForeignKey
ALTER TABLE "apiKeys" ADD CONSTRAINT "apiKeys_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "Bucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
