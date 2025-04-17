import { useQuery } from "@tanstack/react-query";
import { getVaults, getVault } from "@/services/vaultServices";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useGetVaultsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.VAULTS],
    queryFn: getVaults,
  });
};

export const useGetVaultQuery = (vaultId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.VAULT(vaultId),
    queryFn: () => getVault(vaultId),
    enabled: !!vaultId,
  });
};
