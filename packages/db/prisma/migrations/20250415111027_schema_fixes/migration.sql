/*
  Warnings:

  - The values [ADMIN,VIEWER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `githubId` on the `User` table. All the data in the column will be lost.
  - Added the required column `publicKey` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `icon` on table `Vault` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('OWNER', 'MEMBER');
ALTER TABLE "Membership" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "VaultInvite" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "VaultInvite" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "Membership" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
ALTER TABLE "VaultInvite" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- DropIndex
DROP INDEX "User_githubId_key";

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "publicKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubId",
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vault" ALTER COLUMN "icon" SET NOT NULL;
