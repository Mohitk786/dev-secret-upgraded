/*
  Warnings:

  - The `status` column on the `VaultInvite` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "VaultInvite" DROP CONSTRAINT "VaultInvite_vaultId_fkey";

-- AlterTable
ALTER TABLE "VaultInvite" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
