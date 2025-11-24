"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Event, FormField } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, MapPin, Users, Mail, Phone, Clock, AlertTriangle } from "lucide-react"
import { FormFieldRenderer } from "./form-field-renderer"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { AnimatedBackground } from "./animated-background"

interface PublicFormViewProps {
  event: Event
  fields: FormField[]
  isDeadlinePassed?: boolean
}

export function PublicFormView({ event, fields, isDeadlinePassed = false }: PublicFormViewProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData({ ...formData, [fieldId]: value })
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      const value = formData[field.id] || ""

      if (field.required && !value.trim()) {
        newErrors[field.id] = "This field is required"
        return
      }

      if (!value.trim()) return

      if (field.field_type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          newErrors[field.id] = "Please enter a valid email address"
        }
      }

      if (field.field_type === "url" && value) {
        try {
          new URL(value)
        } catch {
          newErrors[field.id] = "Please enter a valid URL"
        }
      }

      if (field.field_type === "number" && value) {
        const num = Number(value)
        if (isNaN(num)) {
          newErrors[field.id] = "Please enter a valid number"
        } else {
          if (field.validation?.min !== undefined && num < field.validation.min) {
            newErrors[field.id] = `Value must be at least ${field.validation.min}`
          }
          if (field.validation?.max !== undefined && num > field.validation.max) {
            newErrors[field.id] = `Value must be at most ${field.validation.max}`
          }
        }
      }

      if (field.validation?.minLength && value.length < field.validation.minLength) {
        newErrors[field.id] = `Must be at least ${field.validation.minLength} characters`
      }
      if (field.validation?.maxLength && value.length > field.validation.maxLength) {
        newErrors[field.id] = `Must be at most ${field.validation.maxLength} characters`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const { data: submission, error: submissionError } = await supabase
        .from("form_submissions")
        .insert({
          event_id: event.id,
          ip_address: null,
          user_agent: navigator.userAgent,
          is_manually_completed: false,
        })
        .select()
        .single()

      if (submissionError) throw submissionError

      const answers = fields.map((field) => ({
        submission_id: submission.id,
        field_id: field.id,
        answer: formData[field.id] || "",
      }))

      const { error: answersError } = await supabase.from("submission_answers").insert(answers)

      if (answersError) throw answersError

      router.push(`/f/${event.slug}/success`)
    } catch (error) {
      console.error("Form submission error:", error)
      setGeneralError("Failed to submit form. Please try again.")
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return null
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (isDeadlinePassed) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <AnimatedBackground />
        <div className="relative flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <Card className="border-2 border-red-200 bg-card/95 shadow-2xl backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mb-6 rounded-full bg-red-100 p-4 dark:bg-red-900/30"
                >
                  <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mb-3 text-3xl font-bold text-foreground"
                >
                  Form Closed
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mb-6 text-lg text-muted-foreground"
                >
                  This form has reached its deadline and is no longer accepting submissions.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="rounded-lg bg-muted p-4"
                >
                  <p className="text-sm font-medium">Deadline: {formatDate(event.deadline)}</p>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="mt-6 text-sm text-muted-foreground"
                >
                  If you have any questions, please contact the organizer.
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <AnimatedBackground />

      <div className="relative flex min-h-screen items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] p-[2px] shadow-2xl animate-shimmer"
          >
            <div className="rounded-2xl bg-card p-8">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex-1">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-3 text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                  >
                    {event.title}
                  </motion.h1>
                  {event.event_type && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-1 text-sm font-medium text-primary"
                    >
                      {event.event_type}
                    </motion.span>
                  )}
                </div>
              </div>

              {event.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-6 text-lg leading-relaxed text-muted-foreground"
                >
                  {event.description}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {event.start_date && (
                  <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 backdrop-blur-sm">
                    <div className="rounded-full bg-primary/20 p-2">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Start Date</p>
                      <p className="text-sm font-semibold">{formatDate(event.start_date)}</p>
                    </div>
                  </div>
                )}

                {event.end_date && (
                  <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 p-4 backdrop-blur-sm">
                    <div className="rounded-full bg-accent/20 p-2">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">End Date</p>
                      <p className="text-sm font-semibold">{formatDate(event.end_date)}</p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 backdrop-blur-sm">
                    <div className="rounded-full bg-primary/20 p-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Location</p>
                      <p className="text-sm font-semibold">{event.location}</p>
                    </div>
                  </div>
                )}

                {event.max_participants && (
                  <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 p-4 backdrop-blur-sm">
                    <div className="rounded-full bg-accent/20 p-2">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Max Participants</p>
                      <p className="text-sm font-semibold">{event.max_participants}</p>
                    </div>
                  </div>
                )}

                {event.organizer_email && (
                  <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 backdrop-blur-sm">
                    <div className="rounded-full bg-primary/20 p-2">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Organizer</p>
                      <p className="text-sm font-semibold">{event.organizer_name || "Contact"}</p>
                      <p className="text-xs text-muted-foreground">{event.organizer_email}</p>
                    </div>
                  </div>
                )}

                {event.organizer_phone && (
                  <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 p-4 backdrop-blur-sm">
                    <div className="rounded-full bg-accent/20 p-2">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm font-semibold">{event.organizer_phone}</p>
                    </div>
                  </div>
                )}

                {event.deadline && (
                  <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 p-4 backdrop-blur-sm dark:from-orange-900/30 dark:to-red-900/30">
                    <div className="rounded-full bg-orange-200 p-2 dark:bg-orange-900/50">
                      <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Deadline</p>
                      <p className="text-sm font-semibold">{formatDate(event.deadline)}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="border-2 border-primary/20 bg-card/95 shadow-2xl backdrop-blur-sm">
              <CardHeader className="space-y-2 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-2xl">Registration Form</CardTitle>
                <CardDescription className="text-base">
                  Please fill out the form below to register for this event
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 pt-6">
                  {generalError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="destructive">
                        <AlertDescription>{generalError}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {fields.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="py-12 text-center"
                    >
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium text-muted-foreground">This form has no fields yet.</p>
                      <p className="text-sm text-muted-foreground">Please check back later or contact the organizer.</p>
                    </motion.div>
                  ) : (
                    fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
                      >
                        <FormFieldRenderer
                          field={field}
                          value={formData[field.id] || ""}
                          error={errors[field.id]}
                          onChange={(value) => handleFieldChange(field.id, value)}
                          disabled={submitting}
                        />
                      </motion.div>
                    ))
                  )}

                  {fields.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + fields.length * 0.05, duration: 0.4 }}
                      className="pt-4"
                    >
                      <Button
                        type="submit"
                        className="w-full cursor-pointer bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] text-lg font-semibold shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={submitting}
                        size="lg"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Registration"
                        )}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
