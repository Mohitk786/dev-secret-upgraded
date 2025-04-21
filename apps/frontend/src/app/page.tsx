"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Shield, Key, Lock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/data";
import { getToken } from "@/lib/helper";
import { useEffect } from "react";

const features = [
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: "Secure Storage",
    description: "Military-grade encryption for your sensitive information",
  },
  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: "Team Collaboration",
    description: "Share secrets safely with your team members",
  },
  {
    icon: <Key className="w-10 h-10 text-primary" />,
    title: "Access Control",
    description: "Fine-grained permissions and access management",
  },
];

const testimonials = [
  {
    text: "KeyVault has revolutionized how we manage our development secrets. It's secure and intuitive!",
    author: "Sarah Johnson",
    role: "CTO at TechCorp",
  },
  {
    text: "The collaboration features are outstanding. Perfect for our remote team!",
    author: "Mike Chen",
    role: "Lead Developer at StartupX",
  },
  {
    text: "Best investment for our team's security. The audit logs are invaluable.",
    author: "Emma Davis",
    role: "Security Engineer at SecureNet",
  },
];

const Index = () => {
  const router = useRouter();
  const token  = getToken();  

  useEffect(() => {   
    if (token) {
      router.push(APP_ROUTES.DASHBOARD);
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Lock className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold">KeyVault</span>
            </div>
            <div className="flex space-x-3">
              {!token &&  <Button variant="ghost" onClick={() => router.push(APP_ROUTES.LOGIN)}>Sign In</Button>}
              <Button onClick={() => router.push(APP_ROUTES.SIGNUP)}>{token ? "Go to Dashboard" : "Get Started"}</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
          >
            Secure Your Development Secrets
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            KeyVault offers robust encryption and collaboration tools for managing API keys, credentials, and secrets safely.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex justify-center gap-3"
          >
            <Button size="lg" onClick={() => router.push(APP_ROUTES.SIGNUP)}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Why Choose KeyVault?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="p-5 rounded-xl bg-card shadow-sm hover:shadow-md transition"
              >
                <div className="mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Trusted by Developers Worldwide</h2>
          <Carousel className="max-w-3xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-6 text-center">
                    <p className="text-base italic mb-4">{testimonial.text}</p>
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Secure Your Secrets?</h2>
          <p className="text-md text-muted-foreground mb-6 max-w-xl mx-auto">
            Join developers across the world using KeyVault to manage and protect their secrets.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => router.push(APP_ROUTES.SIGNUP)}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push(APP_ROUTES.PRICING)}>
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Contact / Collaborate */}
      <section className="py-14 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Want to Collaborate or Have Questions?</h2>
          <p className="text-muted-foreground mb-6">We're always excited to partner and assist you. Reach out to us anytime!</p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="outline" onClick={() => window.open("mailto:support@keyvault.com")}>
              Email Us
            </Button>
            <Button size="lg" onClick={() => router.push("/contact")}>
              Contact Form
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t bg-background">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-primary" />
            <span className="font-medium">KeyVault</span>
          </div>
          <p className="text-muted-foreground">© 2025 KeyVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
