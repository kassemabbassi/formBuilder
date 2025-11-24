"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EventsList } from "@/components/dashboard/events-list"
import { CreateEventDialog } from "@/components/dashboard/create-event-dialog"
import { motion } from "framer-motion"
import type { Event } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  const loadEvents = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })

      if (eventsError) {
        console.error("[v0] Error loading events:", eventsError)
        setError(
          "Failed to load events. Please make sure you've run all database migration scripts in the correct order.",
        )
      } else {
        setEvents(eventsData || [])
      }
    } catch (err) {
      console.error("[v0] Error in loadEvents:", err)
      setError("An unexpected error occurred. Please try refreshing the page.")
    }
  }

  useEffect(() => {
    async function initializeData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          redirect("/auth/signin")
        }

        setUser(user)
        await loadEvents()
      } catch (err) {
        console.error("[v0] Error in initializeData:", err)
        setError("An unexpected error occurred. Please try refreshing the page.")
      } finally {
        setLoading(false)
      }
    }

    initializeData()

    const subscription = supabase
      .channel("events_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          loadEvents()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-primary/5 to-background">
      <DashboardHeader user={user} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                My Events
              </h1>
              <p className="text-muted-foreground mt-1">Create and manage your form events</p>
            </div>
            <CreateEventDialog onEventCreated={loadEvents} />
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <EventsList events={events} onEventDeleted={loadEvents} />
        </div>
      </main>
    </div>
  )
}
