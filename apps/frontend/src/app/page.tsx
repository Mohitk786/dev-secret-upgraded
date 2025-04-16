"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Shield, Key, Lock, Users} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: <Shield className="w-12 h-12 text-primary" />,
    title: "Secure Storage",
    description: "Military-grade encryption for your sensitive information"
  },
  {
    icon: <Users className="w-12 h-12 text-primary" />,
    title: "Team Collaboration",
    description: "Share secrets safely with your team members"
  },
  {
    icon: <Key className="w-12 h-12 text-primary" />,
    title: "Access Control",
    description: "Fine-grained permissions and access management"
  }
];

const testimonials = [
  {
    text: "KeyVault has revolutionized how we manage our development secrets. It's secure and intuitive!",
    author: "Sarah Johnson",
    role: "CTO at TechCorp"
  },
  {
    text: "The collaboration features are outstanding. Perfect for our remote team!",
    author: "Mike Chen",
    role: "Lead Developer at StartupX"
  },
  {
    text: "Best investment for our team's security. The audit logs are invaluable.",
    author: "Emma Davis",
    role: "Security Engineer at SecureNet"
  }
];

const Index = () => {
    const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Lock className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">KeyVault</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => router.push("/login")}>Sign In</Button>
              <Button onClick={() => router.push("/register")}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
          >
            Secure Your Development Secrets
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            KeyVault provides military-grade encryption for your development secrets, 
            API keys, and sensitive data with seamless team collaboration.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex justify-center space-x-4"
          >
            <Button size="lg" onClick={() => router.push("/register")}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose KeyVault?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6 rounded-2xl bg-card hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Developers Worldwide
          </h2>
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-8 text-center">
                    <p className="text-xl italic mb-6">{testimonial.text}</p>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Secrets?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust KeyVault for their secret management needs.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => router.push("/register")}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/pricing")}>
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Lock className="h-6 w-6 text-primary" />
              <span className="font-semibold">KeyVault</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 KeyVault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;