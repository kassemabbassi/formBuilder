import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FormBuilder } from "@/components/form-builder/form-builder"

export default async function EventEditPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await getSupabaseServerClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single()

  if (!event || event.user_id !== user.id) {
    redirect("/dashboard")
  }

  const { data: fields } = await supabase
    .from("form_fields")
    .select("*")
    .eq("event_id", id)
    .order("order_index", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 bg-muted/30">
        <FormBuilder event={event} initialFields={fields || []} />
      </main>
    </div>
  )
}
