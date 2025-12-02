import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PublicFormView } from "@/components/public-form/public-form-view"

export default async function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  const { data: event } = await supabase.from("events").select("*").eq("slug", slug).single()

  if (!event || !event.is_active) {
    notFound()
  }

  const now = new Date()
  const deadline = event.deadline ? new Date(event.deadline) : null

  // Consider the deadline as the end of that day (23:59:59) so the form stays open
  // for the entire specified date and is automatically blocked from the next day on.
  let isDeadlinePassed = false
  if (deadline) {
    const endOfDeadlineDay = new Date(deadline)
    endOfDeadlineDay.setHours(23, 59, 59, 999)
    isDeadlinePassed = now > endOfDeadlineDay
  }

  const { data: fields } = await supabase
    .from("form_fields")
    .select("*")
    .eq("event_id", event.id)
    .order("order_index", { ascending: true })

  return <PublicFormView event={event} fields={fields || []} isDeadlinePassed={isDeadlinePassed} />
}
