"use client"

import type { FormField } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

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

interface ResponseDetailsDialogProps {
  submission: Submission
  fields: FormField[]
  open: boolean
  onClose: () => void
}

export function ResponseDetailsDialog({ submission, fields, open, onClose }: ResponseDetailsDialogProps) {
  const getAnswerForField = (fieldId: string) => {
    const answer = submission.answers.find((a) => a.field_id === fieldId)
    return answer?.answer || "No answer provided"
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Response Details</DialogTitle>
          <DialogDescription>Submitted {format(new Date(submission.submitted_at), "PPpp")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-base font-semibold">{field.label}</Label>
                <div className="rounded-md bg-muted p-3">
                  <p className="whitespace-pre-wrap break-words text-sm">{getAnswerForField(field.id)}</p>
                </div>
              </div>
            ))}

            {submission.user_agent && (
              <div className="space-y-2 border-t pt-4">
                <Label className="text-sm font-semibold text-muted-foreground">Metadata</Label>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>User Agent: {submission.user_agent}</p>
                  <p>Submission ID: {submission.id}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
