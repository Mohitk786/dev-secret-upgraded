import { useQuery } from "@tanstack/react-query";
import { acceptInvite, getInvites, getSharedWithMeVaults, getSharedVault, getVaultCollaborators } from "@/services/collabServices";

export const useCollabQuery = (inviteId: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["collab", inviteId],
        queryFn: () => acceptInvite(inviteId),
        retry: false,
        enabled: !!inviteId
    });

    return { data, isLoading, error };
};

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
