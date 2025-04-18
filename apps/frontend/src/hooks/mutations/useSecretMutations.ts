import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSecret, deleteSecret, updateSecret } from "@/services/secretServices";
import { QUERY_KEYS } from "@/constants/queryKeys";
  import useToast from "@/hooks/utils/useToast";

export const useCreateSecretMutation = () => {
  const queryClient = useQueryClient();
  const {showToast} = useToast();
  return useMutation({
    mutationFn: createSecret,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULTS] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VAULT(variables.vaultId) });
    },
    onError: (err: any) => showToast({
      type: "error",
      message: err.response?.data?.message || "Error creating secret"
    }),
  });
};


export const useUpdateSecretMutation = () => {
  const queryClient = useQueryClient();
  const {showToast} = useToast();

  return useMutation({
    mutationFn: updateSecret,
    onSuccess: (_, { secretId, data }) => {
      const vaultId = data.vaultId;
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULTS] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VAULT(vaultId) });
      showToast({
        type: "success",
        message: "Secret updated successfully!"
      });

    },
    onError: (err: any) => showToast({
      type: "error",
      message: err.response?.data?.message || "Error updating secret"
    }),
  });
};


export const useDeleteSecretMutation = (vaultId: string) => {
  const queryClient = useQueryClient();
  const {showToast} = useToast();
  return useMutation({
    mutationFn: (secretId: string) => deleteSecret(secretId),
    onSuccess: (_, secretId) => {
      showToast({
        type: "success",
        message: "Secret deleted successfully!"
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VAULTS] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VAULT(vaultId) });
    },
    onError: (err: any) => showToast({
      type: "error",
      message: err.response?.data?.message || "Error deleting secret"
    }),
  });
};

