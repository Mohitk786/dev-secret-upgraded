
export interface CreateSecretData {
    key: string;
    value: string;
    environment: "DEVELOPMENT" | "STAGING" | "PRODUCTION";
    type: "GENERIC" | "PASSWORD" | "API_KEY" | "ENV_VARIABLE" | "SSH_KEY" | "DATABASE_CREDENTIAL" | "TOKEN";
    icon?: string;
    vaultId: string;
}


export interface GetSecretsData {
    vaultId: string;
}

export interface DeleteSecretData {
    secretId: string;
    vaultId: string;
}

export interface UpdateSecretData {
    secretId: string;
    key?: string;
    value?: string;
    environment?: "DEVELOPMENT" | "STAGING" | "PRODUCTION";
    type?: "GENERIC" | "PASSWORD" | "API_KEY" | "ENV_VARIABLE" | "SSH_KEY" | "DATABASE_CREDENTIAL" | "TOKEN";
    vaultId: string;
}


export interface VaultUpdatedData {
    vaultId: string;
    name?: string;
    description?: string;
    icon?: string;
}

export interface VaultDeletedData {
    vaultId: string;
}

export interface InviteCollaboratorData {
    email: string;
    vaultId: string;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
    canAdd: boolean;
}

export interface AcceptInviteData {
    inviteId: string;
}

export interface RevokeCollaboratorData {
    vaultId: string;
    collaboratorId: string;
}