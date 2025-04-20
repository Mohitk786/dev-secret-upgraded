import { axiosInstance } from "@/lib/axiosInstance";
import { Invite } from "@/types/types";

export const sendInvite = async (data: Invite) => {

    const response = await axiosInstance.post("/collab/invite", data);
    return response.data;
};

export const acceptInvite = async (inviteId: string) => {
    const response = await axiosInstance.post(`/collab/accept-invite/${inviteId}`);
    return response.data;
};

export const rejectInvite = async (inviteId: string) => {
    const response = await axiosInstance.post(`/collab/reject-invite/${inviteId}`);
    return response.data;
};

export const getInvite = async (inviteId: string) => {
    const response = await axiosInstance.get(`/collab/invite/${inviteId}`);
    return response.data?.invite;
};

export const getInvites = async (type: string, status: string) => { 
    const response = await axiosInstance.get(`/invites?type=${type || "sent"}&status=${status || "ALL"}`);
    return response.data?.invites;
};

export const removeCollaborator = async (vaultId: string, memberId: string) => {
    const response = await axiosInstance.delete(`/collab/members/${vaultId}/${memberId}`);
    return response.data;
};

export const updateCollaboratorPermissions = async (vaultId: string, memberId: string, permissions: any) => {
    const response = await axiosInstance.patch(`/collab/members/${vaultId}/${memberId}`, permissions);
    return response.data;
};

export const getVaultCollaborators = async (vaultId: string) => {
    const response = await axiosInstance.get(`/collab/vault-collaborators/${vaultId}`);
    return response.data?.collaborators;
};

export const getVaultLogs = async (vaultId: string) => {
    const response = await axiosInstance.get(`/secrets/${vaultId}/audit-logs`);
    return response.data;
};

export const getSharedWithMeVaults = async () => {
    const response = await axiosInstance.get("/collab/shared-with-me");
    return response.data?.vaults;
}

export const getSharedVault = async (vaultId: string) => {
    const response = await axiosInstance.get(`/collab/vault/${vaultId}`);
    return response.data?.data;
}

export const confirmAccess = async (data: any) => {
    const response = await axiosInstance.post(`/collab/confirm-access/${data.vaultId}`,{encryptedVaultKeys: data.finalData});
    return response.data;
}

export const toggleAccess = async (data: any) => {
    const response = await axiosInstance.post(`/collab/toggle-access`, {collaboratorId: data.collaboratorId, vaultId: data.vaultId});
    return response.data;
}