
export interface CreateSecretData {
    encryptedSecret: string;
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