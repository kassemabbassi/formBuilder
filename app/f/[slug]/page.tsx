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

  const { data: fields } = await supabase
    .from("form_fields")
    .select("*")
    .eq("event_id", event.id)
    .order("order_index", { ascending: true })

  return <PublicFormView event={event} fields={fields || []} />
}
