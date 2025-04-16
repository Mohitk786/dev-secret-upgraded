/*
  Warnings:

  - You are about to drop the column `hasAccess` on the `EncryptedSecret` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EncryptedSecret" DROP COLUMN "hasAccess";

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "hasSecretAccess" BOOLEAN NOT NULL DEFAULT false;
