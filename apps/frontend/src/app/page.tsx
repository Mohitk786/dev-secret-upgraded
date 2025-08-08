import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Users, ShieldCheck, ScrollText, Sparkles, MailPlus, Code, Rocket, GitFork, Quote, Github, Mail, FileText } from 'lucide-react'

export default function DevVaultLandingPage() {
return (
  <div className="flex flex-col min-h-[100dvh] bg-devvault-white text-devvault-graphite">
    <header className="px-4 lg:px-6 h-16 flex items-center bg-devvault-navy text-devvault-white shadow-md sticky top-0 z-50 bg-background border-b  border-devvault-electric-blue/20">
      <Link href="/" className="flex items-center justify-center gap-2 font-mono text-xl font-bold">
        <Code className="h-6 w-6 text-devvault-electric-blue" />
        DevVault
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
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
      </nav>
    </header>

    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-devvault-navy to-devvault-graphite text-devvault-white">
        <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter font-mono leading-tight">
              Secure. Collaborative. Developer-first.
            </h1>
            <p className="max-w-[700px] mx-auto lg:mx-0 text-lg md:text-xl text-devvault-white/90">
              DevVault is a real-time collaboration platform for developers, tech teams, and content creators to securely
              store, edit, and manage coding documents and knowledge vaults.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                className="inline-flex h-12 items-center justify-center rounded-md bg-devvault-electric-blue px-8 text-base font-medium text-devvault-white shadow-lg transition-colors hover:bg-devvault-electric-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devvault-electric-blue/50"
                asChild
              >
                <Link href="#waitlist">Get Early Access</Link>
              </Button>
              <Button
                variant="outline"
                className="inline-flex h-12 items-center justify-center rounded-md border border-devvault-electric-blue bg-transparent px-8 text-base font-medium text-devvault-electric-blue shadow-md transition-colors hover:bg-devvault-electric-blue hover:text-devvault-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devvault-electric-blue/50"
                asChild
              >
                <Link href="/login">Start Now</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/placeholder.svg?height=500&width=700"
              width={700}
              height={500}
              alt="DevVault Dashboard Mockup"
              className="rounded-xl object-cover shadow-2xl border border-devvault-electric-blue/20"
            />
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-devvault-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter font-mono mb-12 text-devvault-navy">
            Core Features Designed for Developers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardHeader className="flex flex-col items-center p-0 pb-4">
                <Users className="h-12 w-12 text-devvault-electric-blue mb-4" />
                <CardTitle className="text-xl font-semibold font-mono text-devvault-graphite">Real-time Collaboration</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>Edit, delete, view, and add content simultaneously with your team. See changes as they happen.</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardHeader className="flex flex-col items-center p-0 pb-4">
                <Lock className="h-12 w-12 text-devvault-electric-blue mb-4" />
                <CardTitle className="text-xl font-semibold font-mono text-devvault-graphite">End-to-End Encryption</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>Every document and interaction is completely private and secure, ensuring your data is safe.</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardHeader className="flex flex-col items-center p-0 pb-4">
                <ShieldCheck className="h-12 w-12 text-devvault-electric-blue mb-4" />
                <CardTitle className="text-xl font-semibold font-mono text-devvault-graphite">Granular Access Control</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>Invite collaborators, revoke or grant access, and view detailed access logs with ease.</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardHeader className="flex flex-col items-center p-0 pb-4">
                <ScrollText className="h-12 w-12 text-devvault-electric-blue mb-4" />
                <CardTitle className="text-xl font-semibold font-mono text-devvault-graphite">Comprehensive Audit Logs</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>Track every action (edit, delete, view, invite) with timestamps for complete transparency.</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardHeader className="flex flex-col items-center p-0 pb-4">
                <Sparkles className="h-12 w-12 text-devvault-electric-blue mb-4" />
                <CardTitle className="text-xl font-semibold font-mono text-devvault-graphite">Intuitive UI/UX</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>A developer-first, minimal yet powerful interface designed for efficiency and clarity.</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardHeader className="flex flex-col items-center p-0 pb-4">
                <MailPlus className="h-12 w-12 text-devvault-electric-blue mb-4" />
                <CardTitle className="text-xl font-semibold font-mono text-devvault-graphite">Invite & Collaboration Management</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>View all invites, accept/reject, and track their status within a centralized system.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 lg:py-32 bg-devvault-navy text-devvault-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter font-mono mb-12">
            See DevVault in Action
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-4">
              <Image
                src="/placeholder.svg?height=350&width=550"
                width={550}
                height={350}
                alt="DevVault Dashboard"
                className="rounded-lg object-cover shadow-xl border border-devvault-electric-blue/20"
              />
              <h3 className="text-xl font-semibold font-mono">Dashboard Overview</h3>
              <p className="text-devvault-white/80">Quick access to your vaults and recent activity.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Image
                src="/placeholder.svg?height=350&width=550"
                width={550}
                height={350}
                alt="DevVault Access Control"
                className="rounded-lg object-cover shadow-xl border border-devvault-electric-blue/20"
              />
              <h3 className="text-xl font-semibold font-mono">Granular Permissions</h3>
              <p className="text-devvault-white/80">Manage who sees what with fine-grained controls.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Image
                src="/placeholder.svg?height=350&width=550"
                width={550}
                height={350}
                alt="DevVault Live Collaboration"
                className="rounded-lg object-cover shadow-xl border border-devvault-electric-blue/20"
              />
              <h3 className="text-xl font-semibold font-mono">Live Editing Experience</h3>
              <p className="text-devvault-white/80">Collaborate in real-time on code and documents.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-helps" className="w-full py-16 md:py-24 lg:py-32 bg-devvault-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter font-mono mb-12 text-devvault-navy">
            Who Benefits from DevVault?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardHeader className="flex flex-col items-center p-0 pb-4">
                <Code className="h-10 w-10 text-devvault-electric-blue mb-3" />
                <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Developers & Engineers</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>Streamline code reviews, share snippets, and collaborate on documentation without friction.</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardHeader className="flex flex-col items-center p-0 pb-4">
                <Rocket className="h-10 w-10 text-devvault-electric-blue mb-3" />
                <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Startups & Tech Teams</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>Accelerate product development with secure, real-time knowledge sharing and project documentation.</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardHeader className="flex flex-col items-center p-0 pb-4">
                <GitFork className="h-10 w-10 text-devvault-electric-blue mb-3" />
                <CardTitle className="text-lg font-semibold font-mono text-devvault-graphite">Open-Source Projects</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>Maintain clear, versioned documentation and collaborate on contributions securely.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="why-choose" className="w-full py-16 md:py-24 lg:py-32 bg-devvault-graphite text-devvault-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter font-mono mb-12">
            Why DevVault Stands Out
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 text-left">
              <Lock className="h-8 w-8 text-devvault-electric-blue shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold font-mono mb-2">Uncompromised Security</h3>
                <p className="text-devvault-white/80">
                  End-to-end encryption ensures your sensitive code and documents are always private.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <ScrollText className="h-8 w-8 text-devvault-electric-blue shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold font-mono mb-2">Transparent Audit Logs</h3>
                <p className="text-devvault-white/80">
                  Every action is logged with timestamps, providing full accountability and traceability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <Users className="h-8 w-8 text-devvault-electric-blue shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold font-mono mb-2">Seamless Real-time Editing</h3>
                <p className="text-devvault-white/80">
                  Collaborate on documents live, eliminating version conflicts and improving team efficiency.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <Sparkles className="h-8 w-8 text-devvault-electric-blue shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold font-mono mb-2">Purpose-Built for Devs</h3>
                <p className="text-devvault-white/80">
                  No more clunky workarounds. DevVault is designed from the ground up for coding and technical documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32 bg-devvault-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter font-mono mb-12 text-devvault-navy">
            Loved by Teams Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardContent className="p-0">
                <Quote className="h-8 w-8 text-devvault-electric-blue mb-4" />
                <p className="text-lg italic text-muted-foreground mb-4">
                  &quot;DevVault has transformed how our team collaborates on sensitive code. The encryption and audit logs are a game-changer!&quot;
                </p>
                <p className="font-semibold text-devvault-graphite">- Jane Doe, Lead Developer at TechCorp</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardContent className="p-0">
                <Quote className="h-8 w-8 text-devvault-electric-blue mb-4" />
                <p className="text-lg italic text-muted-foreground mb-4">
                  &quot;Finally, a collaboration tool built with developers in mind. The UI is clean, and the real-time editing is flawless.&quot;
                </p>
                <p className="font-semibold text-devvault-graphite">- John Smith, Founder of IndieDev Studio</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-devvault-electric-blue/10">
              <CardContent className="p-0">
                <Quote className="h-8 w-8 text-devvault-electric-blue mb-4" />
                <p className="text-lg italic text-muted-foreground mb-4">
                  &quot;The granular access control and invite management features are incredibly powerful for managing our open-source contributions.&quot;
                </p>
                <p className="font-semibold text-devvault-graphite">- Sarah Lee, Open Source Contributor</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="waitlist" className="w-full py-16 md:py-24 lg:py-32 bg-devvault-electric-blue text-devvault-white text-center">
        <div className="container px-4 md:px-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter font-mono">
            Ready to Elevate Your Collaboration?
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-devvault-white/90">
            Join our waitlist for early access and be among the first to experience secure, real-time collaboration.
          </p>
          <Button
            className="inline-flex h-14 items-center justify-center rounded-md bg-devvault-navy px-10 text-lg font-medium text-devvault-white shadow-xl transition-colors hover:bg-devvault-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devvault-white/50"
            asChild
          >
            <Link href="#contact">Join the Waitlist</Link>
          </Button>
        </div>
      </section>
    </main>

    <footer id="contact" className="flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-devvault-navy/20 bg-devvault-navy text-devvault-white">
      <p className="text-sm text-devvault-white/80">
        &copy; {new Date().getFullYear()} DevVault. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-6 sm:gap-8">
        <Link href="#" className="text-sm hover:underline underline-offset-4 flex items-center gap-1">
          <FileText className="h-4 w-4" /> Privacy Policy
        </Link>
        <Link href="#" className="text-sm hover:underline underline-offset-4 flex items-center gap-1">
          <Mail className="h-4 w-4" /> Contact
        </Link>
        <Link href="#" className="text-sm hover:underline underline-offset-4 flex items-center gap-1">
          <Github className="h-4 w-4" /> GitHub
        </Link>
      </nav>
    </footer>
  </div>
)
}
