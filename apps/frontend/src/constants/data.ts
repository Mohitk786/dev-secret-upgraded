import {
    Home,
    ShieldCheck,
    History,
    CreditCard,
    Package,
    Settings,
    Share,
    Mail,
    Trash,
  } from "lucide-react";

export const BASE_URL ='http://localhost:5000/api';


export const APP_ROUTES = {

    
    DASHBOARD: "/u/dashboard",
    VAULTS: "/u/v",
    VAULTS_NEW: "/u/v/new",
    VAULT_DETAIL: "/u/v/:vaultId",
    
    VAULT_DETAIL_SHARED: "/u/v/shared-with-me/:vaultId",
    SHARED_WITH_ME: "/u/v/shared-with-me",
    INVITES: "/u/invites",
    INVITE_DETAIL: "/u/invites/:inviteId",
    AUDIT_LOGS: "/u/audit-logs",
    RECYCLE_BIN: "/u/recycle-bin",
    SETTINGS: "/u/settings",
  
    LOGIN: "/login",
    SIGNUP: "/signup",
    PRICING: "/u/pricing",
  
}

export const mainNavItems = [
    { title: "Dashboard", icon: Home, href: APP_ROUTES.DASHBOARD },
    { title: "Vaults", icon: ShieldCheck, href: APP_ROUTES.VAULTS },
    { title: "Shared with me", icon: Share, href: APP_ROUTES.SHARED_WITH_ME },
    { title: "Invites", icon: Mail, href: APP_ROUTES.INVITES },
    { title: "Audit Logs", icon: History, href: APP_ROUTES.AUDIT_LOGS },
    { title: "Recycle Bin", icon: Trash, href: APP_ROUTES.RECYCLE_BIN },
    { title: "Settings", icon: Settings, href: APP_ROUTES.SETTINGS },
  ];

export const pricingNavItems = [
    { title: "Upgrade", icon: CreditCard, href: APP_ROUTES.PRICING },
  ];

export const plansNavItems = [
    { title: "Free", icon: CreditCard, href: APP_ROUTES.PRICING },
    { title: "Pro", icon: CreditCard, href: APP_ROUTES.PRICING },
    { title: "Enterprise", icon: CreditCard, href: APP_ROUTES.PRICING },
  ];
  
export const ConfirmModalData = {
    access_to_all: {
        title: "Confirm Access",
        description1: "Are you sure you want to confirm access to all collaborators?",
        description2: "This will allow all collaborators to access the vault",
        buttonText: "Confirm"
    },
    toggle_access: {
        title: "Toggle Access",
        description1: "Are you sure you want to allow access to the collaborator?",
        description2: "This will allow the collaborator to access the vault",
        buttonText: "Confirm"
    },
    remove_collaborator: {
        title: "Remove Collaborator",
        description1: "Are you sure you want to remove the collaborator?",
        description2: "This will remove the collaborator from the vault",
        buttonText: "Confirm"
    }
}



export const features = [
    { name: "Number of vaults", starter: "5", professional: "Unlimited", enterprise: "Unlimited" },
    { name: "Items per vault", starter: "Unlimited", professional: "Unlimited", enterprise: "Unlimited" },
    { name: "Basic encryption", starter: true, professional: true, enterprise: true },
    { name: "Advanced encryption", starter: false, professional: true, enterprise: true },
    { name: "Secure sharing", starter: false, professional: true, enterprise: true },
    { name: "File attachments", starter: "100MB", professional: "1GB", enterprise: "10GB" },
    { name: "User accounts", starter: "1", professional: "10", enterprise: "Unlimited" },
    { name: "Team management", starter: false, professional: true, enterprise: true },
    { name: "Access logs", starter: "7 days", professional: "30 days", enterprise: "1 year" },
    { name: "API access", starter: false, professional: true, enterprise: true },
    { name: "Custom integrations", starter: false, professional: false, enterprise: true },
    { name: "SSO & SAML", starter: false, professional: false, enterprise: true },
    { name: "Priority support", starter: false, professional: true, enterprise: true },
    { name: "Dedicated support", starter: false, professional: false, enterprise: true },
];

export const upcomingFeatures = [
    { name: "Mobile app access", starter: false, professional: true, enterprise: true },
    { name: "Offline mode", starter: false, professional: true, enterprise: true },
    { name: "Biometric authentication", starter: false, professional: true, enterprise: true },
    { name: "Auto-rotation of secrets", starter: false, professional: false, enterprise: true },
    { name: "Compliance reporting", starter: false, professional: false, enterprise: true },
    { name: "Hardware security keys", starter: false, professional: true, enterprise: true },
    { name: "AI-powered secret analysis", starter: false, professional: false, enterprise: true },
    { name: "Custom retention policies", starter: false, professional: true, enterprise: true }
];