-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEdit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canView" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "VaultInvite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canView" BOOLEAN NOT NULL DEFAULT true,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "invitedBy" TEXT NOT NULL,
    "receiverId" TEXT,

    CONSTRAINT "VaultInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VaultInvite" ADD CONSTRAINT "VaultInvite_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultInvite" ADD CONSTRAINT "VaultInvite_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultInvite" ADD CONSTRAINT "VaultInvite_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
