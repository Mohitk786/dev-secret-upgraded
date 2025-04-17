/*
  Warnings:

  - You are about to drop the column `token` on the `Invite` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Invite_token_key";

-- AlterTable
ALTER TABLE "Collaborator" ADD COLUMN     "canAdd" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "token";
