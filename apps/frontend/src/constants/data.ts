import {
    Home,
    ShieldCheck,
    History,
    CreditCard,
    Package,
    Settings,
    Share,
    Mail,
  } from "lucide-react";

export const BASE_URL ='http://localhost:5000/api';


export const mainNavItems = [
    { title: "Dashboard", icon: Home, href: "/u/dashboard" },
    { title: "Vaults", icon: ShieldCheck, href: "/u/dashboard/vaults" },
    { title: "Shared with me", icon: Share, href: "/u/dashboard/vaults/shared-with-me" },
    { title: "Invites", icon: Mail, href: "/invites" },
    { title: "Audit Logs", icon: History, href: "/audit-logs" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ];

export const pricingNavItems = [
    { title: "Upgrade", icon: CreditCard, href: "/pricing" },
  ];

export const plansNavItems = [
    { title: "Free", icon: CreditCard, href: "/free" },
    { title: "Pro", icon: CreditCard, href: "/pro" },
    { title: "Enterprise", icon: CreditCard, href: "/enterprise" },
  ];
  
  

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