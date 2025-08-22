
export interface CreateSecretData {
    encryptedSecrets: string[];
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
    encryptedSecret: string;
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

interface VaultKey {
    vaultId: string;
    userId: string;
    encryptedKey: string;
}


export interface AllowCollaboratorData {
    vaultId: string;
    collaborators: VaultKey[];
}

export interface RemoveCollaboratorData {
    vaultId: string;
    collaboratorId: string;
}

// Return type interfaces
export interface BaseResponse {
    success: boolean;
    message?: string;
}

export interface SecretResponse extends BaseResponse {
    secrets?: any;
    encryptedSecret?: any;
    secretId?: string;
    count?: number;
    error?: string;
}

export interface SecretsResponse extends BaseResponse {
    secrets?: any[];
}

export interface VaultResponse extends BaseResponse {
    vault?: any;
    vaultId?: string;
}

export interface CollaboratorResponse extends BaseResponse {
    collaborator?: any;
    updatedCollaborator?: any;
}

export interface VaultAccessResponse extends BaseResponse {
    owner?: any;
    collaborator?: any;
}

export interface VaultOwnershipResponse extends BaseResponse {
    vault?: any;
}