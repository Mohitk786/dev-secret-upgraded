-- AddForeignKey
ALTER TABLE "VaultInvite" ADD CONSTRAINT "VaultInvite_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
