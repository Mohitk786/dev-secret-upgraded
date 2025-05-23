"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import {
  Clock,
  Key,
  Lock,
  type LucideIcon,
  RefreshCw,
  Shield,
  Trash2,
  Users,
  Zap,
  FileCode,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
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
  const token = getToken();

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
              {!token && (
                <Button
                  variant="ghost"
                  onClick={() => router.push(APP_ROUTES.LOGIN)}
                >
                  Sign In
                </Button>
              )}
              <Button onClick={() => router.push(APP_ROUTES.SIGNUP)}>
                {token ? "Go to Dashboard" : "Get Started"}
              </Button>
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
            KeyVault offers robust encryption and collaboration tools for
            managing API keys, credentials, and secrets safely.
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

      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 relative"
      >
        <div className="absolute inset-0 bg-muted/40 -z-10"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-vault-DEFAULT/20 bg-vault-DEFAULT/10 text-vault-DEFAULT">
              Key Features
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Enterprise-Grade Secret Management
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                deVault provides a comprehensive set of features to help your
                team manage secrets securely and efficiently.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Lock}
              title="End-to-End Encryption"
              description="Your secrets are encrypted before they leave your browser, ensuring only authorized team members can access them."
            />
            <FeatureCard
              icon={Zap}
              title="Real-Time Collaboration"
              description="Work together with your team in real-time, with instant updates and notifications."
            />
            <FeatureCard
              icon={RefreshCw}
              title="Access Control & Permissions"
              description="Fine-grained access controls let you decide who can view, edit, or manage your secrets."
            />
            <FeatureCard
              icon={Trash2}
              title="Trash Recovery"
              description="Accidentally deleted a secret? No problem. Recover it from the trash within 30 days."
            />
            <FeatureCard
              icon={Clock}
              title="Activity Logs"
              description="Keep track of who did what and when with detailed activity logs for all your secrets."
            />
            <FeatureCard
              icon={FileCode}
              title="API Access (Coming Soon)"
              description="Integrate deVault with your CI/CD pipeline and other tools with our upcoming API."
            />
          </div>
        </div>
      </section>

      <section
        id="use-cases"
        className="w-full py-12 md:py-24 lg:py-32 relative"
      >
        <div className="absolute inset-0 bg-muted/40 -z-10"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-vault-DEFAULT/20 bg-vault-DEFAULT/10 text-vault-DEFAULT">
              Use Cases
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Build more securely with your team
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See how teams are using deVault to manage their secrets
                securely.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <UseCaseCard
              title="SaaS Development"
              description="Keep API keys, database credentials, and other sensitive information secure while collaborating with your team."
              icon={Users}
            />
            <UseCaseCard
              title=".env Management"
              description="Manage your environment variables across different environments and share them securely with your team."
              icon={Key}
            />
            <UseCaseCard
              title="Secure Sharing"
              description="Share secrets with contractors, clients, or team members without compromising security."
              icon={Shield}
            />
          </div>
        </div>
      </section>

      {/* Contact / Collaborate */}
      <section className="py-14 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Want to Collaborate or Have Questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            We&apos;re always excited to partner and assist you. Reach out to us
            anytime!
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open("mailto:support@keyvault.com")}
            >
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
          <p className="text-muted-foreground">
            © 2025 KeyVault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative flex flex-col space-y-3 rounded-2xl border bg-background p-6 shadow-sm transition-all hover:shadow-md">
      <div className="absolute right-6 top-6 h-8 w-8 rounded-full bg-vault-DEFAULT/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vault-DEFAULT/10">
        <Icon className="h-6 w-6 text-vault-DEFAULT" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

interface UseCaseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

function UseCaseCard({ title, description, icon: Icon }: UseCaseCardProps) {
  return (
    <div className="group relative flex flex-col space-y-3 rounded-2xl border bg-background p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vault-DEFAULT/10">
        <Icon className="h-6 w-6 text-vault-DEFAULT" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-auto pt-4">
        <Link
          href="#"
          className="inline-flex items-center text-sm font-medium text-vault-DEFAULT"
        >
          Learn more
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
