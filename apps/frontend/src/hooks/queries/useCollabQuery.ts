import { useQuery } from "@tanstack/react-query";
import { getInvites, getSharedWithMeVaults, getSharedVault, getVaultCollaborators } from "@/services/collabServices";
import { getVaultKey } from "@/services/vaultServices";



export const useInvitesQuery = (type: string, status: string) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["invites", type, status],
        queryFn: () => getInvites(type, status)
    });

    return { data, isLoading, error, refetch };
};

export const useSharedVaults = () => {
    const {data, isLoading, error, refetch} = useQuery({
        queryKey:["shared-vaults"],
        queryFn:getSharedWithMeVaults
    })

    return {data, isLoading, error, refetch}
}

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