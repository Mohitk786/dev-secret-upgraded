import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreVault, restoreSecret, permanentDeleteVault, permanentDeleteSecret } from "@/services/trashServices";
import useToast from "../utils/useToast";


export const useRestoreVaultMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation({
    mutationFn: restoreVault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedVaults"] });
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      showToast({
        type: "success",
        message: "Vault restored successfully!",
      });
    },
    onError: (err: any) => showToast({
      type: "error",
      message: err.response?.data?.message || "Error restoring vault",
    }),
  });
};

export const useRestoreSecretMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast(); 
  return useMutation({
    mutationFn: restoreSecret,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedSecrets"] });
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
          showToast({
        type: "success",
        message: "Secret restored successfully!",
      });
    },
    onError: (err: any) => showToast({
      type: "error",
      message: err.response?.data?.message || "Error restoring secret",
    }),
  });
};

export const usePermanentDeleteVaultMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast(); 
  return useMutation({
    mutationFn: permanentDeleteVault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedVaults"] });
        showToast({
        type: "success",
        message: "Vault permanently deleted!",
      });
    },
    onError: (err: any) => showToast({
      type: "error",
      message: err.response?.data?.message || "Error deleting vault",
    }),
  });
};

export const usePermanentDeleteSecretMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast(); 
  
  return useMutation({
    mutationFn: permanentDeleteSecret,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedSecrets"] });
      showToast({
        type: "success",
        message: "Secret permanently deleted!",
      });
    },
    onError: (err: any) => showToast({
      type: "error",
      message: err.response?.data?.message || "Error deleting secret",
    }),
  });
};
