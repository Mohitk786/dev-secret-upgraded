
export interface Secret {
    id?: string;
    key: string
    value: string
    type: "GENERIC" | "PASSWORD" | "API_KEY" | "ENV_VARIABLE" | "SSH_KEY" | "DATABASE_CREDENTIAL" | "TOKEN"
    vaultId?: string
    environment?: "DEVELOPMENT" | "STAGING" | "PRODUCTION"
    createdAt?: string
    updatedAt?: string
}

export interface SecretItemProps {
    secret: Secret;
    visibleSecrets: string[];
    toggleSecretVisibility: (secretId: string) => void;
    onEditSecret: (secret: any) => void;
    isSharedVault: boolean;
    vault: any;
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
