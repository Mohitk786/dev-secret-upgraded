import { Building2, CheckCircle, Sparkles, Users, KeyRound, ShieldCheck, User, Mail, Vault, Headphones, LogOut, Lock } from "lucide-react";
import PricingClient from "@/components/plans";


const featureIcons: Record<string, React.ReactNode> = {
  "Up to 5 vaults": <Vault className="h-5 w-5 text-green-500" />,
  "Unlimited items per vault": <CheckCircle className="h-5 w-5 text-green-500" />,
  "Basic encryption": <Lock className="h-5 w-5 text-yellow-500" />,
  "Email support": <Mail className="h-5 w-5 text-blue-500" />,
  "1 user only": <User className="h-5 w-5 text-gray-500" />,

  "Unlimited vaults": <Vault className="h-5 w-5 text-green-500" />,
  "Advanced encryption": <ShieldCheck className="h-5 w-5 text-purple-500" />,
  "Secure sharing": <Lock className="h-5 w-5 text-teal-500" />,
  "Priority support": <Headphones className="h-5 w-5 text-indigo-500" />,
  "Up to 10 users": <Users className="h-5 w-5 text-orange-500" />,
  "Access control & permissions": <KeyRound className="h-5 w-5 text-pink-500" />,

  "Everything in Professional": <Sparkles className="h-5 w-5 text-yellow-400" />,
  "Dedicated support manager": <Headphones className="h-5 w-5 text-indigo-500" />,
  "Custom integrations": <Building2 className="h-5 w-5 text-sky-500" />,
  "SSO & SAML support": <LogOut className="h-5 w-5 text-fuchsia-500" />,
  "Unlimited users": <Users className="h-5 w-5 text-orange-500" />,
  "Advanced audit logs": <CheckCircle className="h-5 w-5 text-green-600" />,
};


const plans = [
  {
    title: "Starter",
    price: "$9",
    description: "Perfect for individuals and small projects.",
    features: [
      "Up to 5 vaults",
      "Unlimited items per vault",
      "Basic encryption",
      "Email support",
      "1 user only",
    ],
    type: "starter",
  },
  {
    title: "Professional",
    price: "$29",
    description: "Ideal for professionals and growing teams.",
    features: [
      "Unlimited vaults",
      "Advanced encryption",
      "Secure sharing",
      "Priority support",
      "Up to 10 users",
      "Access control & permissions",
    ],
    type: "professional",
    popular: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "For large organizations with advanced security needs.",
    features: [
      "Everything in Professional",
      "Dedicated support manager",
      "Custom integrations",
      "SSO & SAML support",
      "Unlimited users",
      "Advanced audit logs",
    ],
    type: "custom",
    buttonText: "Contact Sales",
  },
];

export default function Pricing() {

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-primary text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that&apos;s right for you and start securing your
          credentials today. All plans include a 14-day free trial.
        </p>
      </div>

      <PricingClient plans={plans} featureIcons={featureIcons} />

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need something different?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Contact our sales team for custom pricing options tailored to your
          specific requirements.
        </p>
        <button className="bg-primary text-white rounded-lg px-6 py-3 hover:bg-primary/90">
          Contact Sales
        </button>
      </div>
    </div>
  );
}
