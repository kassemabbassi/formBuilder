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
import { Loader2, FileText, ArrowLeft, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [emailResent, setEmailResent] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setEmailResent(false)

    const {
      data: { user: existingUser },
      error: getUserError,
    } = await supabase.auth.getUser()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setError(
          "Your email address has not been confirmed yet. Please check your inbox for the confirmation link and click it before signing in.",
        )
      } else if (error.message.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password. Please try again.")
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else if (data?.user) {
      if (!data.user.email_confirmed_at) {
        setError(
          "Your email address has not been confirmed yet. Please check your inbox for the confirmation link and click it before signing in.",
        )
        setLoading(false)
        return
      }
      router.push("/dashboard")
      router.refresh()
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first")
      return
    }

    setResendingEmail(true)
    setError(null)

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    })

    setResendingEmail(false)

    if (error) {
      setError(error.message)
    } else {
      setEmailResent(true)
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
                  Welcome Back
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <CardDescription className="text-base">Sign in to your account to continue</CardDescription>
              </motion.div>
            </CardHeader>
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription className="space-y-2">
                        <p>{error}</p>
                        {error.toLowerCase().includes("confirm") && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleResendConfirmation}
                            disabled={resendingEmail}
                            className="mt-2 w-full border-destructive/30 hover:bg-destructive/10 bg-transparent"
                          >
                            {resendingEmail ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-4 w-4" />
                                Resend Confirmation Email
                              </>
                            )}
                          </Button>
                        )}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                {emailResent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-100">
                      <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription>
                        Confirmation email sent! Please check your inbox and click the link to verify your account.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
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
                    disabled={loading}
                    className="h-11 border-primary/20 transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-base">
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:text-accent transition-colors font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11 border-primary/20 transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="w-full"
                >
                  <Button
                    type="submit"
                    className="h-11 w-full text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  className="text-center text-sm text-muted-foreground"
                >
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="font-semibold text-primary hover:text-accent transition-colors">
                    Sign Up
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
