import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ResponsesView } from "@/components/responses/responses-view"

export default async function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

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

  const { data: submissions } = await supabase
    .from("form_submissions")
    .select("*")
    .eq("event_id", id)
    .order("submitted_at", { ascending: false })

  // Fetch all answers for all submissions
  const submissionIds = submissions?.map((s) => s.id) || []
  const { data: answers } = await supabase.from("submission_answers").select("*").in("submission_id", submissionIds)

  // Combine submissions with their answers
  const submissionsWithAnswers = submissions?.map((submission) => ({
    ...submission,
    answers: answers?.filter((a) => a.submission_id === submission.id) || [],
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1">
        <ResponsesView event={event} fields={fields || []} submissions={submissionsWithAnswers || []} />
      </main>
    </div>
  )
}
