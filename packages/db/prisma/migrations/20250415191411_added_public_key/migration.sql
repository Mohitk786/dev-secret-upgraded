/*
  Warnings:

  - You are about to drop the column `encryptedKey` on the `EncryptedSecret` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedValue` on the `EncryptedSecret` table. All the data in the column will be lost.
  - Added the required column `key` to the `EncryptedSecret` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `EncryptedSecret` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EncryptedSecret" DROP COLUMN "encryptedKey",
DROP COLUMN "encryptedValue",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;
