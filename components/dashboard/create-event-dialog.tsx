"use client"

import { Plus, Loader2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription as DialogDesc,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert } from "@/components/ui/alert"

export function CreateEventDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    eventType: "",
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
    maxParticipants: "",
    bannerColor: "#3b82f6",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const generateSlug = (title: string) => {
    const timestamp = Date.now().toString(36)
    const randomPart1 = Math.random().toString(36).substring(2, 15)
    const randomPart2 = Math.random().toString(36).substring(2, 15)
    const randomPart3 = Math.random().toString(36).substring(2, 15)

    return `${timestamp}-${randomPart1}-${randomPart2}-${randomPart3}`
  }

  const handleCreate = async () => {
    if (!formData.title.trim()) return

    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("You must be logged in to create an event")
        setLoading(false)
        return
      }

      const slug = generateSlug(formData.title)

      const { data, error: insertError } = await supabase
        .from("events")
        .insert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          slug,
          is_active: true,
          start_date: formData.startDate || null,
          end_date: formData.endDate || null,
          location: formData.location.trim() || null,
          event_type: formData.eventType.trim() || null,
          organizer_name: formData.organizerName.trim() || null,
          organizer_email: formData.organizerEmail.trim() || null,
          organizer_phone: formData.organizerPhone.trim() || null,
          max_participants: formData.maxParticipants ? Number.parseInt(formData.maxParticipants) : null,
          banner_color: formData.bannerColor,
        })
        .select()
        .single()

      if (insertError) {
        console.error("[v0] Error creating event:", insertError)
        setError(
          "Failed to create event. Please make sure you've run all database migration scripts (01-create-tables.sql, 02-setup-rls.sql, 03-create-appusers-table.sql).",
        )
        setLoading(false)
        return
      }

      if (data) {
        setOpen(false)
        setFormData({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          location: "",
          eventType: "",
          organizerName: "",
          organizerEmail: "",
          organizerPhone: "",
          maxParticipants: "",
          bannerColor: "#3b82f6",
        })
        router.push(`/dashboard/events/${data.id}`)
        router.refresh()
      }
    } catch (err) {
      console.error("[v0] Unexpected error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Create New Event
          </DialogTitle>
          <DialogDesc>Fill in the details to create a professional event form</DialogDesc>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Annual Tech Conference 2025"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Event Description
              </Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of your event..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-base font-semibold">
                  Start Date & Time
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-base font-semibold">
                  End Date & Time
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={loading}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold">
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Convention Center, New York or Virtual Event"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-base font-semibold">
                  Event Type
                </Label>
                <Input
                  id="eventType"
                  placeholder="e.g., Conference, Workshop, Webinar"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="text-base font-semibold">
                  Max Participants
                </Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  disabled={loading}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-lg">Organizer Information</h3>

              <div className="space-y-2">
                <Label htmlFor="organizerName" className="text-base font-semibold">
                  Organizer Name
                </Label>
                <Input
                  id="organizerName"
                  placeholder="e.g., John Doe"
                  value={formData.organizerName}
                  onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizerEmail" className="text-base font-semibold">
                    Organizer Email
                  </Label>
                  <Input
                    id="organizerEmail"
                    type="email"
                    placeholder="organizer@example.com"
                    value={formData.organizerEmail}
                    onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizerPhone" className="text-base font-semibold">
                    Organizer Phone
                  </Label>
                  <Input
                    id="organizerPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.organizerPhone}
                    onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
                    disabled={loading}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="bannerColor" className="text-base font-semibold">
                Banner Color
              </Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="bannerColor"
                  type="color"
                  value={formData.bannerColor}
                  onChange={(e) => setFormData({ ...formData, bannerColor: e.target.value })}
                  disabled={loading}
                  className="h-11 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.bannerColor}
                  onChange={(e) => setFormData({ ...formData, bannerColor: e.target.value })}
                  disabled={loading}
                  className="h-11 flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading || !formData.title.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
