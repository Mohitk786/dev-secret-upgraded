
import { axiosInstance } from "@/lib/axiosInstance";

export const getDeletedVaults = async () => {
    const res = await axiosInstance.get("/trash/vaults");
    return res.data?.vaults;
};

export const getDeletedSecrets = async () => {
    const res = await axiosInstance.get("/trash/secrets");
    return res.data?.secrets;
};

export const restoreVault = async (vaultId: string) => {
    const res = await axiosInstance.post(`/trash/vaults/${vaultId}/restore`);
    return res.data;
};

export const restoreSecret = async (secretId: string) => {
    const res = await axiosInstance.post(`/trash/secrets/${secretId}/restore`);
    return res.data;
};

export const permanentDeleteVault = async (vaultId: string) => {
    const res = await axiosInstance.delete(`/trash/vaults/${vaultId}`);
    return res.data;

};

export const permanentDeleteSecret = async (secretId: string) => {
    const res = await axiosInstance.delete(`/trash/secrets/${secretId}`);
    return res.data;
};

export const emptyTrash = async () => {
    const res = await axiosInstance.delete("/trash/empty");
    return res.data;
};
