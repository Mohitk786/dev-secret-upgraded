import { z } from "zod";

export interface Secret {
    id?: string;
    encryptedSecret: string;
    vaultId: string;
    key: string;
    value: string;
    type: string;
    environment: string;
    createdAt?: string
    updatedAt?: string
}

export interface SecretItemProps {
    secret: Secret;
    visibleSecrets: string[];
    toggleSecretVisibility: (secretId: string) => void;
    onEditSecret: (secret: any) => void;
    isSharedVault: boolean;
    vault?: any;
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
    user: {
        id: string;
        email: string;
        name?: string;
        avatarUrl?: string;
        publicKey: string;
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


export const formSchema = z.object({
    key: z.string().min(1, { message: "Secret name is required" }),
    value: z.string().min(1, { message: "Secret value is required" }),
    environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
    type: z.enum(["GENERIC", "PASSWORD", "API_KEY", "ENV_VARIABLE", "SSH_KEY", "DATABASE_CREDENTIAL", "TOKEN"]),
  });
  
export type AddSecretFormValues = z.infer<typeof formSchema>;
  