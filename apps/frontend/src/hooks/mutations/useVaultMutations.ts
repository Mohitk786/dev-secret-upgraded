import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVault, deleteVault, updateVault } from "@/services/vaultServices";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useRouter } from "next/navigation";
import useToast from "../utils/useToast";
import { APP_ROUTES } from "@/constants/data";
export const useCreateVaultMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  return useMutation({
    mutationFn: createVault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULTS] });
      showToast({type: "success", message: "Vault created successfully! ✨"});
      router.push(APP_ROUTES.VAULTS);
    },
    onError: (err: any) => showToast({type: "error", message: err.response?.data?.message || "Error"}),
  });
};

export const useUpdateVaultMutation = () => {
  const queryClient = useQueryClient(); 
  const { showToast } = useToast();
  return useMutation({
    mutationFn: updateVault,
    onSuccess: (_, { vaultId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULTS] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VAULT(vaultId) });
      showToast({type: "success", message: "Vault updated!"});
    },
  });
};

export const useDeleteVaultMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation({
    mutationFn: deleteVault,
    onSuccess: ({ vaultId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULTS] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VAULT(vaultId) });
      showToast({type: "success", message: "Vault deleted!"});
    },
  });
};
