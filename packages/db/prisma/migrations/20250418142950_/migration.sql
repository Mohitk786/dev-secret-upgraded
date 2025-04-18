/*
  Warnings:

  - You are about to drop the column `environment` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Secret` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Secret` table. All the data in the column will be lost.
  - Added the required column `encryptedSecret` to the `Secret` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Secret" DROP COLUMN "environment",
DROP COLUMN "icon",
DROP COLUMN "key",
DROP COLUMN "type",
DROP COLUMN "value",
ADD COLUMN     "encryptedSecret" TEXT NOT NULL;
