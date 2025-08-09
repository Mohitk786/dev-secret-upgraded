import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Lock,
  Users,
  ShieldCheck,
  ScrollText,
  Sparkles,
  MailPlus,
  Code,
  Rocket,
  GitFork,
  Quote,
  Github,
  Mail,
  FileText,
} from "lucide-react";

export default function DevVaultLandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-devvault-white text-devvault-graphite">
      <header
        role="banner"
        className="px-4 lg:px-6 h-16 flex items-center bg-devvault-navy text-devvault-white shadow-sm sticky top-0 z-50 border-b border-devvault-navy/10"
      >
        <div className="devvault-container flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 text-base md:text-lg font-mono font-bold">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] shadow-md">
              <Code className="h-5 w-5 text-devvault-white" />
            </span>
            <span>DevVault</span>
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden md:flex gap-6 items-center">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-helps" className="text-sm font-medium hover:underline underline-offset-4">
              Solutions
            </Link>
            <Link href="#why-choose" className="text-sm font-medium hover:underline underline-offset-4">
              Why DevVault
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
            <Link href="/login" className="ml-2">
              <Button className="btn-outline">Sign in</Button>
            </Link>
          </nav>

          {/* mobile actions */}
          <div className="ml-auto md:hidden">
            <Link href="/login">
              <Button className="btn-primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="w-full py-14 md:py-20 lg:py-28 bg-gradient-to-br from-devvault-navy to-devvault-graphite text-devvault-white">
          <div className="devvault-container grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-5 lg:max-w-xl fade-in-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-mono leading-tight">
                Secure. Collaborative. Developer-first.
              </h1>
              <p className="text-lg md:text-xl text-devvault-white/90">
                DevVault is a real-time collaboration platform for developers, tech teams, and creators to securely store,
                edit and manage code, documentation and knowledge vaults — all with enterprise-grade auditing and
                encryption.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="#waitlist" className="w-full sm:w-auto">
                  <Button className="btn-primary">Get Early Access</Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="btn-outline">Start Now</Button>
                </Link>
              </div>

              <div className="mt-3 text-sm text-devvault-white/80">
                <strong>Built for teams:</strong> role-based access, real-time editing, end-to-end encryption, and
                transparent audit logs.
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Image
                src="/placeholder.svg?height=500&width=700"
                width={700}
                height={500}
                alt="DevVault Dashboard Mockup"
                className="hero-mockup"
                priority
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="w-full py-16 md:py-20 lg:py-28 bg-devvault-white">
          <div className="devvault-container text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-mono mb-10 text-devvault-navy">
              Core Features Designed for Developers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-glass">
                <CardHeader className="flex flex-col items-center p-0 pb-4">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] mb-3">
                    <Users className="h-6 w-6 text-devvault-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Real-time Collaboration</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2 muted">
                  Edit, comment, and sync changes live — everyone stays on the same page with conflict-free editing.
                </CardContent>
              </Card>

              <Card className="card-glass">
                <CardHeader className="flex flex-col items-center p-0 pb-4">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] mb-3">
                    <Lock className="h-6 w-6 text-devvault-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">End-to-End Encryption</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2 muted">
                  Zero-knowledge encryption by design — your data is encrypted on the client and unreadable to servers.
                </CardContent>
              </Card>

              <Card className="card-glass">
                <CardHeader className="flex flex-col items-center p-0 pb-4">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] mb-3">
                    <ShieldCheck className="h-6 w-6 text-devvault-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Granular Access Control</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2 muted">
                  Role-based permissions, temporary links, and per-document keys — control exactly who can do what.
                </CardContent>
              </Card>

              <Card className="card-glass">
                <CardHeader className="flex flex-col items-center p-0 pb-4">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] mb-3">
                    <ScrollText className="h-6 w-6 text-devvault-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Comprehensive Audit Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2 muted">
                  Immutable, timestamped logs for every action — perfect for compliance and incident reviews.
                </CardContent>
              </Card>

              <Card className="card-glass">
                <CardHeader className="flex flex-col items-center p-0 pb-4">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] mb-3">
                    <Sparkles className="h-6 w-6 text-devvault-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Intuitive UI/UX</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2 muted">
                  Minimal, keyboard-friendly UI with first-class support for code blocks and snippets.
                </CardContent>
              </Card>

              <Card className="card-glass">
                <CardHeader className="flex flex-col items-center p-0 pb-4">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] mb-3">
                    <MailPlus className="h-6 w-6 text-devvault-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Invite & Collaboration Management</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2 muted">
                  Quickly invite teammates, set granular roles, and monitor invite acceptance — all in one panel.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* demo images */}
        <section className="w-full py-16 md:py-20 lg:py-24 bg-devvault-navy text-devvault-white">
          <div className="devvault-container text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-mono mb-8">See DevVault in Action</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=350&width=550"
                    width={550}
                    height={350}
                    alt={`DevVault demo ${i}`}
                    className="rounded-lg object-cover shadow-xl border border-[hsla(var(--devvault-electric-blue)/0.12)]"
                  />
                  <h3 className="text-lg font-semibold font-mono">Feature snapshot</h3>
                  <p className="text-devvault-white/80">A short caption explaining the screenshot and why it matters.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who benefits */}
        <section id="how-it-helps" className="w-full py-16 md:py-20 lg:py-28 bg-devvault-white">
          <div className="devvault-container text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-mono mb-10 text-devvault-navy">Who Benefits from DevVault?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-glass">
                <CardHeader className="flex flex-col items-center p-0 pb-4">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] mb-3">
                    <Code className="h-5 w-5 text-devvault-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Developers & Engineers</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2 muted">Streamline code reviews, share snippets, and collaborate on docs without friction.</CardContent>
              </Card>

              <Card className="card-glass">
                <CardHeader className="flex flex-col items-center p-0 pb-4">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] mb-3">
                    <Rocket className="h-5 w-5 text-devvault-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Startups & Tech Teams</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2 muted">Accelerate product development with secure, real-time knowledge sharing.</CardContent>
              </Card>

              <Card className="card-glass">
                <CardHeader className="flex flex-col items-center p-0 pb-4">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[linear-gradient(90deg,hsl(var(--devvault-electric-blue)),hsl(var(--devvault-accent)))] mb-3">
                    <GitFork className="h-5 w-5 text-devvault-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Open-Source Projects</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2 muted">Maintain clear, versioned documentation and collaborate on contributions securely.</CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why choose */}
        <section id="why-choose" className="w-full py-16 md:py-20 lg:py-28 bg-devvault-graphite text-devvault-white">
          <div className="devvault-container text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-mono mb-8">Why DevVault Stands Out</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex items-start gap-4 text-left">
                <Lock className="h-7 w-7 text-devvault-electric-blue shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold font-mono mb-1">Uncompromised Security</h3>
                  <p className="text-devvault-white/80">End-to-end encryption ensures your sensitive code and documents are always private.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <ScrollText className="h-7 w-7 text-devvault-electric-blue shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold font-mono mb-1">Transparent Audit Logs</h3>
                  <p className="text-devvault-white/80">Every action is logged with timestamps, providing full accountability and traceability.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <Users className="h-7 w-7 text-devvault-electric-blue shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold font-mono mb-1">Seamless Real-time Editing</h3>
                  <p className="text-devvault-white/80">Collaborate on documents live, eliminating version conflicts and improving team efficiency.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <Sparkles className="h-7 w-7 text-devvault-electric-blue shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold font-mono mb-1">Purpose-Built for Devs</h3>
                  <p className="text-devvault-white/80">No more clunky workarounds. DevVault is designed from the ground up for coding and technical documentation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-16 md:py-20 lg:py-28 bg-devvault-white">
          <div className="devvault-container text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-mono mb-10 text-devvault-navy">Loved by Teams Worldwide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-glass">
                <CardContent className="p-0">
                  <Quote className="h-6 w-6 text-devvault-electric-blue mb-4" />
                  <p className="text-lg italic text-muted mb-4">"DevVault has transformed how our team collaborates on sensitive code. The encryption and audit logs are a game-changer!"</p>
                  <p className="font-semibold text-devvault-graphite">- Jane Doe, Lead Developer at TechCorp</p>
                </CardContent>
              </Card>

              <Card className="card-glass">
                <CardContent className="p-0">
                  <Quote className="h-6 w-6 text-devvault-electric-blue mb-4" />
                  <p className="text-lg italic text-muted mb-4">"Finally, a collaboration tool built with developers in mind. The UI is clean, and the real-time editing is flawless."</p>
                  <p className="font-semibold text-devvault-graphite">- John Smith, Founder of IndieDev Studio</p>
                </CardContent>
              </Card>

              <Card className="card-glass">
                <CardContent className="p-0">
                  <Quote className="h-6 w-6 text-devvault-electric-blue mb-4" />
                  <p className="text-lg italic text-muted mb-4">"The granular access control and invite management features are incredibly powerful for managing our open-source contributions."</p>
                  <p className="font-semibold text-devvault-graphite">- Sarah Lee, Open Source Contributor</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="w-full py-16 md:py-20 lg:py-28 bg-devvault-electric-blue text-devvault-white text-center">
          <div className="devvault-container space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-mono">Ready to Elevate Your Collaboration?</h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-devvault-white/90">Join our waitlist for early access and be among the first to experience secure, real-time collaboration.</p>
            <div className="flex justify-center">
              <Link href="#contact">
                <Button className="btn-primary">Join the Waitlist</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="contact"
        className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-devvault-navy/12 bg-devvault-navy text-devvault-white"
      >
        <div className="devvault-container flex items-center gap-4">
          <p className="text-sm text-devvault-white/80">&copy; {new Date().getFullYear()} DevVault. All rights reserved.</p>
          <nav className="ml-auto flex gap-6 items-center">
            <Link href="#" className="text-sm hover:underline underline-offset-4 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Privacy Policy
            </Link>
            <Link href="#" className="text-sm hover:underline underline-offset-4 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Contact
            </Link>
            <Link href="#" className="text-sm hover:underline underline-offset-4 flex items-center gap-2">
              <Github className="h-4 w-4" /> GitHub
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}