/*
  Warnings:

  - The `status` column on the `VaultInvite` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VaultInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "VaultInvite" DROP COLUMN "status",
ADD COLUMN     "status" "VaultInviteStatus" NOT NULL DEFAULT 'PENDING';
