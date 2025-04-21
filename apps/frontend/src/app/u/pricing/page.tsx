"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { axiosInstance } from "@/lib/axiosInstance";


import { CheckCircle, ShieldCheck, User, Vault, Lock, Users, Mail, Sparkles, Headphones, Building2, KeyRound, LogOut } from "lucide-react";

const featureIcons: Record<string, any> = {
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

const Pricing = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axiosInstance.get("/premium/verify");
    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };


  const handleBuyClick = async (type: string) => {
    const order = await axiosInstance.post("/payment/create", {
      membershipType: type,
    });

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev Vault",
      description: "Secure your secrets",
      order_id: orderId,
      prefill: {
        name: notes.name,
        email: notes.email,
        contact: "+91 7668785567",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const enhanceFeatures = (features: string[]) =>
    features.map((feature) => ({
      text: feature,
      icon: featureIcons[feature],
    }));

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that&apos;s right for you and start securing your
          credentials today. All plans include a 14-day free trial.
        </p>
      </div>

      <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        <PricingTier
          buttonText={isUserPremium ? "Already Purchased" : "Buy Now"}
          onClick={() => handleBuyClick("starter")}
          title="Starter"
          price="$9"
          description="Perfect for individuals and small projects."
          features={enhanceFeatures([
            "Up to 5 vaults",
            "Unlimited items per vault",
            "Basic encryption",
            "Email support",
            "1 user only",
          ])}
        />

        <PricingTier
          buttonText={isUserPremium ? "Already Purchased" : "Buy Now"}
          onClick={() => handleBuyClick("Professional")}
          title="Professional"
          price="$29"
          description="Ideal for professionals and growing teams."
          features={enhanceFeatures([
            "Unlimited vaults",
            "Advanced encryption",
            "Secure sharing",
            "Priority support",
            "Up to 10 users",
            "Access control & permissions",
          ])}
          popular={true}
        />

        <PricingTier
          onClick={() => handleBuyClick("custom")}
          title="Enterprise"
          price="Custom"
          description="For large organizations with advanced security needs."
          features={enhanceFeatures([
            "Everything in Professional",
            "Dedicated support manager",
            "Custom integrations",
            "SSO & SAML support",
            "Unlimited users",
            "Advanced audit logs",
          ])}
          buttonText="Contact Sales"
        />
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need something different?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Contact our sales team for custom pricing options tailored to your
          specific requirements.
        </p>
        <Button variant="outline" size="lg">
          Contact Sales
        </Button>
      </div>
    </div>
  );
};



const PricingTier = ({
  title,
  price,
  description,
  features,
  popular = false,
  buttonText = "Get Started",
  onClick,
}: {
  title: string;
  price: string;
  description: string;
  features: { text: string; icon: any }[];
  popular?: boolean;
  buttonText?: string;
  onClick: () => void;
}) => {





  return (<Card
    className={`flex flex-col ${popular ? "border-primary shadow-lg ring-2 ring-primary/20" : ""
      }`}
  >
    <CardHeader>
      {popular && (
        <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
          Most Popular
        </div>
      )}
      <CardTitle className="text-xl">{title}</CardTitle>
      <div className="mt-2">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Custom" && (
          <span className="text-muted-foreground ml-1">/month</span>
        )}
      </div>
      <CardDescription className="mt-3">{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex gap-2 items-center">
            <p>{feature.icon}</p>
            <span className="text-sm">{feature.text}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button
        onClick={() => {
          if (buttonText === "Contact Sales") {
            window.location.href = "mailto:kumarmohit08004@gmail.com";
          } else {
            onClick();
          }
        }}
        variant={popular ? "default" : "outline"}
        className={`w-full ${popular ? "" : "hover:bg-primary hover:text-primary-foreground"
          }`}
      >
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
  );
}


export default Pricing;
