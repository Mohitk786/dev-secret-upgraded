/*
  Warnings:

  - You are about to drop the column `secretId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EncryptedSecret` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VaultInvite` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaultId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Secret` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CollaboratorStatus" AS ENUM ('ACCEPTED', 'REVOKED');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_secretId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "EncryptedSecret" DROP CONSTRAINT "EncryptedSecret_secretId_fkey";

-- DropForeignKey
ALTER TABLE "EncryptedSecret" DROP CONSTRAINT "EncryptedSecret_userId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_createrId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_vaultId_fkey";

-- DropForeignKey
ALTER TABLE "Secret" DROP CONSTRAINT "Secret_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "VaultInvite" DROP CONSTRAINT "VaultInvite_invitedBy_fkey";

-- DropForeignKey
ALTER TABLE "VaultInvite" DROP CONSTRAINT "VaultInvite_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "VaultInvite" DROP CONSTRAINT "VaultInvite_vaultId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "secretId",
DROP COLUMN "userId",
ADD COLUMN     "actorId" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "vaultId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Secret" DROP COLUMN "creatorId",
DROP COLUMN "deleted",
DROP COLUMN "deletedAt",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT,
ALTER COLUMN "environment" DROP DEFAULT,
ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "password",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Vault" ALTER COLUMN "icon" DROP NOT NULL;

-- DropTable
DROP TABLE "EncryptedSecret";

-- DropTable
DROP TABLE "Membership";

-- DropTable
DROP TABLE "VaultInvite";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "VaultInviteStatus";

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "status" "CollaboratorStatus" NOT NULL DEFAULT 'ACCEPTED',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecretEncryption" (
    "id" TEXT NOT NULL,
    "secretId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecretEncryption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "inviteeEmail" TEXT NOT NULL,
    "inviteeId" TEXT,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_userId_vaultId_key" ON "Collaborator"("userId", "vaultId");

-- CreateIndex
CREATE UNIQUE INDEX "SecretEncryption_secretId_userId_key" ON "SecretEncryption"("secretId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "Invite"("token");

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretEncryption" ADD CONSTRAINT "SecretEncryption_secretId_fkey" FOREIGN KEY ("secretId") REFERENCES "Secret"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretEncryption" ADD CONSTRAINT "SecretEncryption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secret" ADD CONSTRAINT "Secret_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
