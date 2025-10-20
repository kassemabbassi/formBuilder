"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, FileText, ArrowLeft, CheckCircle2, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (!displayName.trim()) {
      setError("Display name is required")
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (data?.user) {
        const { error: insertError } = await supabase.from("appusers").insert({
          user_id: data.user.id,
          email: email,
          display_name: displayName,
        })

        if (insertError) {
          console.error("Error creating user profile:", insertError)
        }
      }

      setSuccess(true)
      setLoading(false)

      if (data?.user?.identities?.length === 0) {
        setError("An account with this email already exists. Please sign in instead.")
        setSuccess(false)
      } else if (data?.user && !data?.session) {
        setNeedsConfirmation(true)
      } else {
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1500)
      }
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(96,165,250,0.15),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary shadow-lg shadow-primary/30"
              >
                <FileText className="h-7 w-7 text-primary-foreground" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <CardDescription className="text-base">Get started with your free account today</CardDescription>
              </motion.div>
            </CardHeader>
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                {success && needsConfirmation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-100">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertDescription className="space-y-2">
                        <p className="font-semibold">Check your email!</p>
                        <p className="text-sm">
                          We've sent a confirmation link to <strong>{email}</strong>. Please click the link to verify
                          your account before signing in.
                        </p>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                {success && !needsConfirmation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-100">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription>Account created successfully! Redirecting to dashboard...</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="displayName" className="text-base">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    disabled={loading || success}
                    className="h-11 border-primary/20 transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || success}
                    className="h-11 border-primary/20 transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-base">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || success}
                    className="h-11 border-primary/20 transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirm-password" className="text-base">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading || success}
                    className="h-11 border-primary/20 transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="w-full"
                >
                  <Button
                    type="submit"
                    className="h-11 w-full text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]"
                    disabled={loading || success}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                  className="text-center text-sm text-muted-foreground"
                >
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="font-semibold text-primary hover:text-accent transition-colors">
                    Sign In
                  </Link>
                </motion.p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
