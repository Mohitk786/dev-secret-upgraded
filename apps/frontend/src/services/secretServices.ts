
import { axiosInstance } from "@/lib/axiosInstance";

export const getSecrets = async () => {
  const res = await axiosInstance.get("/secrets/all");
  return res.data?.data;
};

export const getSecret = async (secretId: string) => {
  const res = await axiosInstance.get(`/secrets/${secretId}`);
  return res.data?.secret;
};

export const getSecretsByVault = async (vaultId: string) => {
  const res = await axiosInstance.get(`/secrets/vault/${vaultId}`);
  return res.data?.secrets;
};

export const createSecret = async (data: any) => {
  const res = await axiosInstance.post("/secrets/create", data);
  return res.data;
};

export const updateSecret = async ({ secretId, data }: { secretId: string; data: any }) => {
  const res = await axiosInstance.put(`/secrets/${secretId}`, data);
  return res.data;
};

export const deleteSecret = async (secretId: string) => {
  const res = await axiosInstance.delete(`/secrets/${secretId}`);
  return { ...res.data, secretId };
};
