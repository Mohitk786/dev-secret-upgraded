import { useQuery } from "@tanstack/react-query";
import { getSharedVault, getVaultCollaborators } from "@/services/collabServices";
import { getVaultKey } from "@/services/vaultServices";






export const useGetSharedVaultQuery = (vaultId: string) => {
    return useQuery({
      queryKey: ["shared-vault", vaultId],
      queryFn: () => getSharedVault(vaultId),
      enabled: !!vaultId,
    });
};


export const useGetVaultCollaboratorsQuery = (vaultId: string) => {
    return useQuery({
      queryKey: ["vault-collaborators", vaultId],
      queryFn: () => getVaultCollaborators(vaultId),
      enabled: !!vaultId,
    });
  };


  export const useGetVaultKeyQuery = (vaultId: string) => {
    return useQuery({
      queryKey: ["vault-key", vaultId],
      queryFn: () => getVaultKey(vaultId),
      enabled: !!vaultId,
    });
  };    