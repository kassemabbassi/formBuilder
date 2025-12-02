"use client"

import { useState, useMemo } from "react"
import type { Event, FormField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Search, FileText, Filter, Share2 } from "lucide-react"
import Link from "next/link"
import { ResponsesTable } from "./responses-table"
import { ResponseDetailsDialog } from "./response-details-dialog"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

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

  const shareFormLink = async () => {
    try {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/f/${event.slug}`
          : `/f/${event.slug}`

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      }

      toast({
        title: "Form link copied",
        description: "You can now share it with your participants.",
      })
    } catch {
      toast({
        title: "Unable to copy link",
        description: "Please copy the URL from your browser address bar.",
        variant: "destructive",
      })
    }
  }

 

  return (
    <div className="
      /* Container with responsive padding */
      container mx-auto 
      px-3 py-4
      sm:px-4 sm:py-6
      md:px-6 md:py-8
      lg:px-8
      /* Ensure full height */
      min-h-screen
    ">
      {/* Header Section */}
      <div className="
        mb-4
        sm:mb-6
        md:mb-8
      ">
        {/* Back Button - Top on mobile, left-aligned on larger screens */}
        <div className="
          mb-4
          sm:mb-6
        ">
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              size="sm"
              className="
                w-full justify-center
                sm:w-auto sm:justify-start
                /* Hover effects */
                transition-all duration-200
                hover:bg-muted/50
              "
            >
              <ArrowLeft className="
                mr-2 h-4 w-4
                sm:h-3.5 sm:w-3.5
              " />
              <span className="
                text-sm
                sm:text-xs
              ">
                Back to Dashboard
              </span>
            </Button>
          </Link>
        </div>

        {/* Title Section */}
        <div className="
          text-center
          sm:text-left
          space-y-2
          sm:space-y-3
        ">
          <h1 className="
            text-2xl font-bold leading-tight
            sm:text-3xl
            md:text-4xl
            lg:text-5xl
            break-words
          ">
            {event.title}
          </h1>
          <p className="
            text-sm text-muted-foreground
            sm:text-base
            md:text-lg
            max-w-4xl
          ">
            View and manage form responses
          </p>
        </div>
      </div>

      {/* Stats Cards - Hidden on mobile, shown on tablet and up */}
      <div className="
        hidden
        sm:grid sm:grid-cols-2
        lg:grid-cols-4
        gap-4
        mb-6
        md:mb-8
      ">
        <Card className="
          bg-gradient-to-br from-blue-50 to-indigo-50
          dark:from-blue-950/20 dark:to-indigo-950/20
        ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Responses</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="
          bg-gradient-to-br from-green-50 to-emerald-50
          dark:from-green-950/20 dark:to-emerald-950/20
        ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Filtered</p>
                <p className="text-2xl font-bold">{filteredSubmissions.length}</p>
              </div>
              <Filter className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Section */}
      <div className="
        mb-4
        sm:mb-6
        md:mb-8
        space-y-4
      ">
        {/* Search Bar and Actions Container */}
        <div className="
          flex flex-col
          sm:flex-row
          gap-4
        ">
          {/* Search Input - Full width on mobile, flexible on larger screens */}
          <div className="
            relative flex-1
            w-full
          ">
            <Search className="
              absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground
              sm:left-3
            " />
            <Input
              placeholder="Search responses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                pl-9 pr-4 py-2
                sm:pl-10
                text-sm
                sm:text-base
                w-full
                /* Focus styles */
                transition-all duration-200
                focus:ring-2 focus:ring-primary/20
              "
            />
          </div>

          {/* Action Buttons */}
          <div className="
            flex gap-2
            /* Mobile: full width buttons */
            flex-col
            sm:flex-row
            /* Tablet+: auto width */
            sm:w-auto
          ">
            
            
            <Button 
              variant="outline" 
              onClick={exportToCSV} 
              disabled={submissions.length === 0}
              className="
                w-full
                sm:w-auto
                justify-center
                /* Disabled styles */
                disabled:opacity-50 disabled:cursor-not-allowed
                /* Hover effects */
                transition-all duration-200
                hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200
                dark:hover:bg-blue-950/20
              "
            >
              <Download className="
                mr-2 h-4 w-4
                sm:mr-2
              " />
              <span className="
                text-sm
                sm:text-sm
              ">
                <span className="sm:hidden">Export</span>
                <span className="hidden sm:inline">Export CSV</span>
              </span>
            </Button>
          </div>
        </div>

        {/* Search Results Info - Mobile only */}
        {searchQuery && (
          <div className="
            sm:hidden
            bg-muted/50 rounded-lg p-3
            text-sm text-muted-foreground
          ">
            Found {filteredSubmissions.length} response{filteredSubmissions.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {submissions.length === 0 ? (
        <Card className="
          /* Shadow and border */
          shadow-sm border-border/50
          /* Responsive margins */
          mx-auto
          max-w-2xl
        ">
          <CardContent className="
            flex flex-col items-center justify-center 
            py-12
            sm:py-16
            md:py-20
            px-4
          ">
            <div className="
              rounded-full bg-muted p-4 mb-4
              sm:p-5 sm:mb-6
            ">
              <FileText className="
                h-8 w-8 text-muted-foreground
                sm:h-10 sm:w-10
              " />
            </div>
            <h3 className="
              text-lg font-semibold mb-2 text-center
              sm:text-xl sm:mb-3
            ">
              No responses yet
            </h3>
            <p className="
              text-sm text-muted-foreground text-center mb-6 max-w-sm
              sm:text-base sm:mb-8
            ">
              Share your form link to start collecting responses
            </p>
            <Button 
              onClick={shareFormLink}
              className="
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-700 hover:to-indigo-700
                transition-all duration-200
                transform hover:scale-105
              "
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Form Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="
          /* Shadow and border */
          shadow-sm border-border/50
          /* Smooth transitions */
          transition-all duration-200
        ">
          <CardHeader className="
            pb-4
            sm:pb-6
            /* Responsive padding */
            px-4
            sm:px-6
          ">
            <div className="
              flex flex-col
              sm:flex-row sm:items-center sm:justify-between
              gap-3
            ">
              <div>
                <CardTitle className="
                  text-lg
                  sm:text-xl
                  md:text-2xl
                ">
                  Responses
                  <span className="
                    text-muted-foreground ml-2
                    text-sm
                    sm:text-base
                  ">
                    ({filteredSubmissions.length})
                  </span>
                </CardTitle>
                <CardDescription className="
                  text-sm
                  sm:text-base
                  mt-1
                ">
                  {filteredSubmissions.length === submissions.length
                    ? `Showing all ${submissions.length} responses`
                    : `Showing ${filteredSubmissions.length} of ${submissions.length} responses`}
                  {searchQuery && (
                    <span className="
                      hidden
                      sm:inline
                    ">
                      {" "}for "<strong>{searchQuery}</strong>"
                    </span>
                  )}
                </CardDescription>
              </div>
              
              {/* Mobile Stats - Shown only on mobile */}
              <div className="
                sm:hidden
                flex items-center gap-4
                text-xs text-muted-foreground
              ">
                <span>Total: {submissions.length}</span>
                {searchQuery && (
                  <span>Filtered: {filteredSubmissions.length}</span>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="
            px-0
            sm:px-6
            /* Remove default padding for table to take full width */
            pb-4
            sm:pb-6
          ">
            <ResponsesTable 
              submissions={filteredSubmissions} 
              fields={fields} 
              onViewDetails={setSelectedSubmission} 
            />
          </CardContent>
        </Card>
      )}

      {/* Response Details Dialog */}
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