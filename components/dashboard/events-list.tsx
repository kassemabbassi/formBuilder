"use client"

import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink, Eye, Settings, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EventsListProps {
  events: Event[]
}

export function EventsList({ events }: EventsListProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (eventId: string) => {
    setDeletingId(eventId)
    await supabase.from("events").delete().eq("id", eventId)
    router.refresh()
    setDeletingId(null)
  }

  const copyFormLink = (slug: string) => {
    const url = `${window.location.origin}/f/${slug}`
    navigator.clipboard.writeText(url)
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No events yet</h3>
            <p className="text-center text-muted-foreground">Create your first event to start collecting responses</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
        >
          <Card className="flex flex-col border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="line-clamp-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1.5">
                    {event.description || "No description"}
                  </CardDescription>
                </div>
                <Badge
                  variant={event.is_active ? "default" : "secondary"}
                  className={
                    event.is_active ? "bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20" : ""
                  }
                >
                  {event.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex w-full gap-2">
                <Link href={`/dashboard/events/${event.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all bg-transparent"
                    size="sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/dashboard/events/${event.id}/responses`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all bg-transparent"
                    size="sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Responses
                  </Button>
                </Link>
              </div>
              <div className="flex w-full gap-2">
                <Button
                  variant="secondary"
                  className="flex-1 bg-gradient-to-r from-secondary to-secondary/80 hover:opacity-90"
                  size="sm"
                  onClick={() => copyFormLink(event.slug)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deletingId === event.id}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this event? This action cannot be undone and will delete all
                        associated responses.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(event.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
