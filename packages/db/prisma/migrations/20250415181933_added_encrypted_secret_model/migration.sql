/*
  Warnings:

  - You are about to drop the column `publicKey` on the `Membership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "publicKey";

-- CreateTable
CREATE TABLE "EncryptedSecret" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "secretId" TEXT NOT NULL,
    "encryptedKey" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EncryptedSecret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EncryptedSecret_userId_secretId_key" ON "EncryptedSecret"("userId", "secretId");

-- AddForeignKey
ALTER TABLE "EncryptedSecret" ADD CONSTRAINT "EncryptedSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncryptedSecret" ADD CONSTRAINT "EncryptedSecret_secretId_fkey" FOREIGN KEY ("secretId") REFERENCES "Secret"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
