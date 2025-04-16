
export interface Secret {
    id: string;
    key: string
    value: string
    type: string
    vaultId: string
    environment: string
    createdAt: string
    updatedAt: string
    encryptedSecrets?: any[];
}

export interface SecretItemProps {
    secret: Secret;
    visibleSecrets: string[];
    toggleSecretVisibility: (secretId: string) => void;
    onEditSecret: (secret: any) => void;
    isSharedVault: boolean;
  }

export interface NavItem {
    title: string;
    icon: React.ElementType;
    href: string;
  }

export interface Invite { 
    email: string;
    vaultId: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export interface Collaborator {
    id: string;
    userId: string;
    vaultId: string;
    role: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    user?: {
        id: string;
        email: string;
        name?: string;
        avatarUrl?: string;
    }
}

export interface AuditLog {
    id: string;
    action: string;
    createdAt: string;
    userId: string;
    secretId: string;
    user?: {
        id: string;
        email: string;
        name?: string;
    };
    secret?: {
        id: string;
        key: string;
        type: string;
    };
}
