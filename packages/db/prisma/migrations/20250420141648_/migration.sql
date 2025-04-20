/*
  Warnings:

  - The `membershipType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('SILVER', 'GOLD');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "membershipType",
ADD COLUMN     "membershipType" "MembershipType";
