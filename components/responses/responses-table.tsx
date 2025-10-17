"use client"

import type { FormField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Submission {
  id: string
  event_id: string
  submitted_at: string
  answers: Array<{
    id: string
    submission_id: string
    field_id: string
    answer: string
  }>
}

interface ResponsesTableProps {
  submissions: Submission[]
  fields: FormField[]
  onViewDetails: (submission: Submission) => void
}

export function ResponsesTable({ submissions, fields, onViewDetails }: ResponsesTableProps) {
  const getAnswerForField = (submission: Submission, fieldId: string) => {
    const answer = submission.answers.find((a) => a.field_id === fieldId)
    if (!answer?.answer) return "-"

    // Truncate long answers
    if (answer.answer.length > 50) {
      return answer.answer.substring(0, 50) + "..."
    }
    return answer.answer
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] sticky left-0 bg-background z-10">Submitted</TableHead>
            {fields.map((field) => (
              <TableHead key={field.id} className="min-w-[200px]">
                {field.label}
              </TableHead>
            ))}
            <TableHead className="w-[100px] sticky right-0 bg-background z-10">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="text-sm text-muted-foreground sticky left-0 bg-background z-10">
                {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
              </TableCell>
              {fields.map((field) => (
                <TableCell key={field.id} className="min-w-[200px]">
                  {getAnswerForField(submission, field.id)}
                </TableCell>
              ))}
              <TableCell className="sticky right-0 bg-background z-10">
                <Button variant="ghost" size="sm" onClick={() => onViewDetails(submission)} className="cursor-pointer">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
