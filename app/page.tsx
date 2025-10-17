"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Share2, BarChart3, Sparkles, Zap, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary shadow-lg shadow-primary/20">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FormBuilder
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/signin">
              <Button variant="ghost" className="hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(96,165,250,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(59,130,246,0.05)_50%,transparent_100%)]" />

        <div className="container relative mx-auto flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 text-sm backdrop-blur-sm shadow-lg shadow-primary/10"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">Professional form builder for everyone</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Create{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Professional Forms
              </span>{" "}
              in Minutes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-pretty text-xl text-muted-foreground sm:text-2xl leading-relaxed"
            >
              Build custom forms with drag-and-drop simplicity. Collect responses, analyze data, and share with anyone
              securely.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="gap-2 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-xl shadow-primary/30 transition-all hover:scale-105"
                >
                  Start Building Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-105 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-t bg-gradient-to-b from-muted/30 to-background py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-balance text-4xl font-bold">Everything You Need</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features to create and manage your forms effortlessly
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Drag & Drop Builder",
                description:
                  "Create forms easily with our intuitive drag-and-drop interface. Add any field type you need with just a click.",
                delay: 0,
              },
              {
                icon: Shield,
                title: "Secure Sharing",
                description:
                  "Share your forms with a secure link. Control access and protect your data with enterprise-grade security.",
                delay: 0.1,
              },
              {
                icon: BarChart3,
                title: "Response Analytics",
                description:
                  "View and analyze all responses in one place. Search, filter, and export your data with powerful tools.",
                delay: 0.2,
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Built for speed and performance. Create, share, and collect responses in real-time without any delays.",
                delay: 0.3,
              },
              {
                icon: Share2,
                title: "Easy Collaboration",
                description:
                  "Share forms via secure links. Participants can fill forms from any device without creating an account.",
                delay: 0.4,
              },
              {
                icon: Sparkles,
                title: "Smart Validation",
                description:
                  "Built-in validation for all field types. Ensure data quality with customizable rules and requirements.",
                delay: 0.5,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-primary/10 bg-gradient-to-br from-card to-card/50 p-8 shadow-lg shadow-primary/5 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg shadow-primary/20"
                >
                  <feature.icon className="h-7 w-7 text-primary" />
                </motion.div>
                <h3 className="mb-3 text-2xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container relative mx-auto px-4 text-center"
        >
          <div className="mx-auto max-w-2xl space-y-8">
            <h2 className="text-balance text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join thousands of users creating professional forms today. No credit card required.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="gap-2 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-xl shadow-primary/30 transition-all hover:scale-105"
              >
                Create Your First Form
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="mt-auto border-t bg-gradient-to-b from-muted/30 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FormBuilder
              </span>
            </div>
            <p className="text-sm text-muted-foreground">&copy; 2025 FormBuilder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
