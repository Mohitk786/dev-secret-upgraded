import { axiosInstance } from "@/lib/axiosInstance";

export const getVaults = async () => {
  const res = await axiosInstance.get("/vaults/all");
  return res.data?.vaults;
};

export const getVault = async (vaultId: string) => {
  const res = await axiosInstance.get(`/vaults/${vaultId}`);
  console.log("🔑 vault", res.data?.vault)
  return res.data?.vault;
};

export const createVault = async (data: any) => {
  const res = await axiosInstance.post("/vaults/create", data);
  return res.data;
};

export const updateVault = async ({ vaultId, data }: { vaultId: string; data: any }) => {
  const res = await axiosInstance.put(`/vaults/${vaultId}`, data);
  return res.data;
};

export const deleteVault = async (vaultId: string) => {
  const res = await axiosInstance.delete(`/vaults/${vaultId}`);
  return { ...res.data, vaultId };
};

export const getVaultKey = async (vaultId: string) => {
  try{
    const response = await axiosInstance.get(`/vaults/${vaultId}/vault-key`);
    return response.data?.vaultKey; 
  }catch(err){
      console.log("Error getting vault key", err);
      return null;
  }
  } 