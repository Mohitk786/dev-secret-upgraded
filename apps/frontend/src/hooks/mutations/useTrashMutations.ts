import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreVault, restoreSecret, permanentDeleteVault, permanentDeleteSecret } from "@/services/trashServices";
import useToast from "../utils/useToast";
import { toast } from "react-toastify";

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

  return useMutation({
    mutationFn: restoreSecret,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedSecrets"] });
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      toast.success("Secret restored successfully!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error restoring secret"),
  });
};

export const usePermanentDeleteVaultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentDeleteVault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedVaults"] });
      toast.success("Vault permanently deleted!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error deleting vault"),
  });
};

export const usePermanentDeleteSecretMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentDeleteSecret,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedSecrets"] });
      toast.success("Secret permanently deleted!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error deleting secret"),
  });
};
