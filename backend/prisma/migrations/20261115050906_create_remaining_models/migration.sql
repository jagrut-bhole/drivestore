-- CreateEnum
CREATE TYPE "ObjectStatus" AS ENUM ('PENDING', 'UPLOADING', 'COMPLETE', 'FAILED', 'MISSING', 'DELETED');

-- CreateEnum
CREATE TYPE "ChunkStatus" AS ENUM ('PENDING', 'STORED', 'MISSING');

-- CreateEnum
CREATE TYPE "DriveAccountStatus" AS ENUM ('ACTIVE', 'NEEDS_RECONNECT', 'DISCONNECT');

-- CreateTable
CREATE TABLE "storedObject" (
    "id" UUID NOT NULL,
    "bucketId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "size" BIGINT NOT NULL DEFAULT 0,
    "contentType" TEXT NOT NULL,
    "md5" TEXT NOT NULL,
    "status" "ObjectStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storedObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectChunk" (
    "id" TEXT NOT NULL,
    "objectId" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "driveAccountId" UUID NOT NULL,
    "driveFileId" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "md5" TEXT,
    "status" "ChunkStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ObjectChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadSession" (
    "id" TEXT NOT NULL,
    "objectId" UUID NOT NULL,
    "driveSessionUri" TEXT NOT NULL,
    "bytesUploaded" BIGINT NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driveAccounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "googleSub" TEXT NOT NULL,
    "googleEmail" TEXT NOT NULL,
    "refreshTokenEnc" TEXT NOT NULL,
    "scopes" TEXT[],
    "status" "DriveAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "rootFolderId" TEXT,
    "quotaTotal" BIGINT,
    "quotaused" BIGINT,
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driveAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "storedObject_bucketId_key_key" ON "storedObject"("bucketId", "key");

-- CreateIndex
CREATE INDEX "ObjectChunk_driveFileId_idx" ON "ObjectChunk"("driveFileId");

-- CreateIndex
CREATE UNIQUE INDEX "ObjectChunk_objectId_index_key" ON "ObjectChunk"("objectId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "UploadSession_objectId_key" ON "UploadSession"("objectId");

-- CreateIndex
CREATE INDEX "driveAccounts_userId_idx" ON "driveAccounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "driveAccounts_userId_googleSub_key" ON "driveAccounts"("userId", "googleSub");

-- AddForeignKey
ALTER TABLE "Bucket" ADD CONSTRAINT "Bucket_driveAccountId_fkey" FOREIGN KEY ("driveAccountId") REFERENCES "driveAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storedObject" ADD CONSTRAINT "storedObject_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "Bucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectChunk" ADD CONSTRAINT "ObjectChunk_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "storedObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectChunk" ADD CONSTRAINT "ObjectChunk_driveAccountId_fkey" FOREIGN KEY ("driveAccountId") REFERENCES "driveAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadSession" ADD CONSTRAINT "UploadSession_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "storedObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driveAccounts" ADD CONSTRAINT "driveAccounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
