/*
  Warnings:

  - You are about to drop the column `projectId` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,vaultId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vaultId` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaultId` to the `Secret` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Secret" DROP CONSTRAINT "Secret_projectId_fkey";

-- DropIndex
DROP INDEX "Membership_userId_projectId_key";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "projectId",
ADD COLUMN     "vaultId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Secret" DROP COLUMN "projectId",
ADD COLUMN     "vaultId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Project";

-- CreateTable
CREATE TABLE "Vault" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Vault_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_vaultId_key" ON "Membership"("userId", "vaultId");

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secret" ADD CONSTRAINT "Secret_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
