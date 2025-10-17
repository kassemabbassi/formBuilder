"use client"

import { useState, useMemo } from "react"
import type { Event, FormField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Search, FileText } from "lucide-react"
import Link from "next/link"
import { ResponsesTable } from "./responses-table"
import { ResponseDetailsDialog } from "./response-details-dialog"

interface Submission {
  id: string
  event_id: string
  submitted_at: string
  ip_address?: string
  user_agent?: string
  answers: Array<{
    id: string
    submission_id: string
    field_id: string
    answer: string
  }>
}

interface ResponsesViewProps {
  event: Event
  fields: FormField[]
  submissions: Submission[]
}

export function ResponsesView({ event, fields, submissions }: ResponsesViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions

    const query = searchQuery.toLowerCase()
    return submissions.filter((submission) => {
      return submission.answers.some((answer) => {
        const field = fields.find((f) => f.id === answer.field_id)
        return answer.answer.toLowerCase().includes(query) || field?.label.toLowerCase().includes(query)
      })
    })
  }, [submissions, searchQuery, fields])

  const exportToCSV = () => {
    if (submissions.length === 0) return

    // Create CSV header
    const headers = ["Submission ID", "Submitted At", ...fields.map((f) => f.label)]
    const csvRows = [headers.join(",")]

    // Add data rows
    submissions.forEach((submission) => {
      const row = [
        submission.id,
        new Date(submission.submitted_at).toLocaleString(),
        ...fields.map((field) => {
          const answer = submission.answers.find((a) => a.field_id === field.id)
          return `"${(answer?.answer || "").replace(/"/g, '""')}"`
        }),
      ]
      csvRows.push(row.join(","))
    })

    // Download CSV
    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${event.slug}-responses-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-muted-foreground">View and manage form responses</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search responses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} disabled={submissions.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No responses yet</h3>
            <p className="text-center text-muted-foreground">Share your form link to start collecting responses</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Responses ({filteredSubmissions.length})</CardTitle>
            <CardDescription>
              {filteredSubmissions.length === submissions.length
                ? `Showing all ${submissions.length} responses`
                : `Showing ${filteredSubmissions.length} of ${submissions.length} responses`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsesTable submissions={filteredSubmissions} fields={fields} onViewDetails={setSelectedSubmission} />
          </CardContent>
        </Card>
      )}

      {selectedSubmission && (
        <ResponseDetailsDialog
          submission={selectedSubmission}
          fields={fields}
          open={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  )
}
