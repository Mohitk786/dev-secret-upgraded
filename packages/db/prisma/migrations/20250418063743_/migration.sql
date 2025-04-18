/*
  Warnings:

  - You are about to drop the column `encryptedVaultKeyBase64` on the `Vault` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vault" DROP COLUMN "encryptedVaultKeyBase64";

-- CreateTable
CREATE TABLE "VaultKey" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "encryptedKey" TEXT NOT NULL,

    CONSTRAINT "VaultKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VaultKey_vaultId_userId_key" ON "VaultKey"("vaultId", "userId");

-- AddForeignKey
ALTER TABLE "VaultKey" ADD CONSTRAINT "VaultKey_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultKey" ADD CONSTRAINT "VaultKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
