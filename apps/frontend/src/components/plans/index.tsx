"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axiosInstance";

type Plan = {
  title: string;
  price: string;
  description: string;
  features: string[];
  type: string;
  popular?: boolean;
  buttonText?: string;
};

export default function PricingClient({
  plans,
  featureIcons,
}: {
  plans: Plan[];
  featureIcons: Record<string, React.ReactNode>;
}) {
  const [isUserPremium, setIsUserPremium] = useState(false);

  const verifyPremiumUser = async () => {
    const res = await axiosInstance.get("/premium/verify");
    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  useEffect(() => {
    verifyPremiumUser();
  }, []);

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
      theme: { color: "#F37254" },
      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
      {plans.map((plan, idx) => (
        <Card
          key={idx}
          className={`flex flex-col ${plan.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : ""}`}
        >
          <CardHeader>
            {plan.popular && (
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-gray-200 mb-2">
                Most Popular
              </div>
            )}
            <CardTitle className="text-xl">{plan.title}</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.price !== "Custom" && (
                <span className="text-muted-foreground ml-1">/month</span>
              )}
            </div>
            <CardDescription className="mt-3">{plan.description}</CardDescription>
          </CardHeader>

          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex gap-2 items-center">
                  <p>{featureIcons[f]}</p>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => {
                if (plan.buttonText === "Contact Sales") {
                  window.location.href = "mailto:kumarmohit08004@gmail.com";
                } else {
                  handleBuyClick(plan.type);
                }
              }}
              variant={plan.popular ? "default" : "outline"}
              className="w-full"
            >
              {plan.buttonText || (isUserPremium ? "Already Purchased" : "Buy Now")}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
