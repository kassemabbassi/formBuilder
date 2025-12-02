"use client"

import type { FormField } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Loader2, Trash2, Edit2, Save, X } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  onDelete?: (submissionId: string) => void
}

export function ResponseDetailsDialog({ submission, fields, open, onClose, onDelete }: ResponseDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAnswers, setEditedAnswers] = useState<Record<string, string>>({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const getAnswerForField = (fieldId: string) => {
    return (
      editedAnswers[fieldId] ?? submission.answers.find((a) => a.field_id === fieldId)?.answer ?? "No answer provided"
    )
  }

  const handleEdit = () => {
    const answers: Record<string, string> = {}
    submission.answers.forEach((answer) => {
      answers[answer.field_id] = answer.answer
    })
    setEditedAnswers(answers)
    setIsEditing(true)
    setError(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedAnswers({})
    setError(null)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    setError(null)
    try {
      console.log("Starting save for submission:", submission.id)
      console.log("Edited answers:", editedAnswers)

      // Check if submission exists first
      const { data: existingSubmission, error: checkError } = await supabase
        .from("form_submissions")
        .select("id")
        .eq("id", submission.id)
        .single()
      
      if (checkError) {
        console.error("Error checking submission:", checkError)
        throw new Error("Submission not found")
      }

      const updatePromises = Object.entries(editedAnswers).map(async ([fieldId, answer]) => {
        const submissionAnswer = submission.answers.find((a) => a.field_id === fieldId)
        if (submissionAnswer) {
          console.log(`Updating answer ${submissionAnswer.id} for field ${fieldId}`)
          
          const { error: updateError, data: updatedData, count } = await supabase
            .from("submission_answers")
            .update({ answer })
            .eq("id", submissionAnswer.id)
            .select()

          if (updateError) {
            console.error("Error updating answer:", updateError)
            throw new Error(`Failed to update answer: ${updateError.message}`)
          }
          
          if (!updatedData || updatedData.length === 0) {
            console.error("No rows updated for answer:", submissionAnswer.id)
            throw new Error("Failed to update answer - no rows affected. Check RLS policies for UPDATE operations.")
          }
          
          console.log("Updated answer:", updatedData)
          return updatedData
        }
      })

      const results = await Promise.all(updatePromises)
      console.log("All updates completed:", results)
      
      setIsEditing(false)
      setEditedAnswers({})
      
      // Close dialog to reflect the saved state; parent can optionally refresh data.
      onClose()
    } catch (error: any) {
      console.error("Error saving changes:", error)
      setError(error.message || "Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    setError(null)
    
    try {
      console.log("Starting deletion for submission:", submission.id)
      
      // Check if submission exists first
      const { data: existingSubmission, error: checkError } = await supabase
        .from("form_submissions")
        .select("id")
        .eq("id", submission.id)
        .single()
      
      if (checkError) {
        console.error("Error checking submission:", checkError)
        if (checkError.code === 'PGRST116') {
          throw new Error("Submission not found or already deleted")
        }
        throw new Error(`Failed to verify submission: ${checkError.message}`)
      }
      
      console.log("Found submission:", existingSubmission)
      
      // First delete the answers
      const { error: answersError, count: deletedAnswersCount } = await supabase
        .from("submission_answers")
        .delete({ count: 'exact' })
        .eq("submission_id", submission.id)

      if (answersError) {
        console.error("Error deleting answers:", answersError)
        throw new Error(`Failed to delete answers: ${answersError.message}`)
      }
      
      console.log("Deleted answers count:", deletedAnswersCount)

      // Then delete the submission
      const { error: submissionError, count: deletedSubmissionCount } = await supabase
        .from("form_submissions")
        .delete({ count: 'exact' })
        .eq("id", submission.id)

      if (submissionError) {
        console.error("Error deleting submission:", submissionError)
        throw new Error(`Failed to delete submission: ${submissionError.message}`)
      }
      
      console.log("Deleted submission count:", deletedSubmissionCount)
      
      if (deletedSubmissionCount === 0) {
        throw new Error("Failed to delete submission - no rows affected. Check RLS policies.")
      }

      // Success - close dialogs and refresh
      setShowDeleteConfirm(false)
      onClose()
      
      // Trigger parent component refresh
      if (onDelete) {
        onDelete(submission.id)
      }
    } catch (error: any) {
      console.error("Error in delete operation:", error)
      setError(error.message || "Failed to delete response. Please try again.")
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isDeleting && !isSaving) {
      onClose()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="
          /* Mobile First - Full width with small margins */
          w-[95vw] mx-auto p-4 max-h-[95dvh]
          /* Small tablets */
          sm:w-[90vw] sm:max-w-2xl sm:p-6
          /* Large tablets and small laptops */
          md:w-[85vw] md:max-w-3xl
          /* Desktop */
          lg:max-w-4xl lg:p-8
          /* Extra large screens */
          xl:max-w-5xl
          
          /* Layout */
          flex flex-col
          /* Smooth transitions for all interactive elements */
          transition-all duration-200
        ">
          <DialogHeader className="
            /* Mobile */
            px-1 pb-4
            /* Tablet and up */
            sm:px-2 sm:pb-6
          ">
            <DialogTitle className="
              text-lg font-semibold leading-tight
              sm:text-xl
              lg:text-2xl
            ">
              Response Details
            </DialogTitle>
            <DialogDescription className="
              text-sm text-muted-foreground mt-1
              sm:text-base
              lg:text-lg
            ">
              Submitted {format(new Date(submission.submitted_at), "PPpp")}
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="
              rounded-lg bg-red-50 p-3 text-sm text-red-700 
              dark:bg-red-950/50 dark:text-red-200 
              mx-1 mb-4 border border-red-200
              sm:mx-2 sm:p-4 sm:text-base
            ">
              {error}
            </div>
          )}
          
          <ScrollArea className="
            /* Mobile */
            max-h-[45dvh] px-1
            /* Small tablets */
            sm:max-h-[50dvh] sm:px-2
            /* Tablets and small laptops */
            md:max-h-[55dvh]
            /* Desktop */
            lg:max-h-[60dvh]
            /* Smooth scrolling */
            scroll-smooth
          ">
            <div className="
              space-y-4 pr-2
              sm:space-y-5 sm:pr-4
              lg:space-y-6
            ">
              {fields.map((field) => (
                <div key={field.id} className="
                  space-y-2 border-b border-border/50 pb-4 last:border-b-0
                  sm:space-y-3 sm:pb-5
                  lg:pb-6
                ">
                  <Label className="
                    text-sm font-semibold leading-relaxed
                    sm:text-base
                    lg:text-lg
                  ">
                    {field.label}
                  </Label>
                  {isEditing ? (
                    <Input
                      value={getAnswerForField(field.id)}
                      onChange={(e) => setEditedAnswers({ ...editedAnswers, [field.id]: e.target.value })}
                      className="
                        h-10 text-sm
                        sm:h-11 sm:text-base
                        lg:h-12
                        transition-colors duration-200
                      "
                    />
                  ) : (
                    <div className="
                      rounded-lg bg-muted/50 p-3 min-h-[3rem]
                      sm:p-4 sm:min-h-[3.5rem]
                      lg:p-5
                      border border-border/20
                      transition-colors duration-200
                    ">
                      <p className="
                        whitespace-pre-wrap break-words 
                        text-sm leading-relaxed
                        sm:text-base
                        lg:text-lg lg:leading-loose
                      ">
                        {getAnswerForField(field.id)}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {submission.user_agent && (
                <div className="
                  space-y-2 border-t border-border pt-4
                  sm:space-y-3 sm:pt-5
                  lg:pt-6
                ">
                  <Label className="
                    text-xs font-semibold text-muted-foreground uppercase tracking-wide
                    sm:text-sm
                  ">
                    Metadata
                  </Label>
                  <div className="
                    space-y-1 text-xs text-muted-foreground
                    sm:space-y-2 sm:text-sm
                  ">
                    <p className="break-all leading-relaxed">
                      <span className="font-medium">User Agent:</span> {submission.user_agent}
                    </p>
                    <p className="break-all leading-relaxed">
                      <span className="font-medium">Submission ID:</span> {submission.id}
                    </p>
                    {submission.ip_address && (
                      <p className="break-all leading-relaxed">
                        <span className="font-medium">IP Address:</span> {submission.ip_address}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter className="
            /* Mobile - Stacked layout */
            flex flex-col gap-3 mt-6 px-1
            /* Small tablets - Start row layout */
            sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:mt-8 sm:px-2
            /* Desktop */
            lg:mt-10
            
            /* Smooth transitions */
            transition-all duration-200
          ">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="
                    /* Mobile - Full width */
                    w-full cursor-pointer order-2
                    /* Tablet and up - Auto width */
                    sm:w-auto sm:order-1
                    /* Hover effects */
                    transition-all duration-200
                  "
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="
                    /* Mobile - Full width */
                    w-full cursor-pointer order-1 mb-2
                    /* Tablet and up - Auto width */
                    sm:w-auto sm:order-2 sm:mb-0
                    /* Gradient background */
                    bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                    /* Smooth transitions */
                    transition-all duration-200 transform hover:scale-[1.02]
                  "
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="sm:hidden">Saving...</span>
                      <span className="hidden sm:inline">Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      <span className="sm:hidden">Save</span>
                      <span className="hidden sm:inline">Save Changes</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={onClose}
                  className="
                    w-full cursor-pointer bg-transparent order-3
                    sm:w-auto sm:order-1
                    transition-all duration-200
                  "
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="
                    w-full cursor-pointer bg-transparent order-1 mb-2
                    sm:w-auto sm:order-2 sm:mb-0
                    text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50
                    transition-all duration-200
                  "
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Response
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="
                    w-full cursor-pointer order-2
                    sm:w-auto sm:order-3
                    transition-all duration-200
                  "
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Response
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="
          /* Mobile First */
          w-[95vw] mx-auto p-4
          /* Small tablets */
          sm:max-w-lg sm:p-6
          /* Tablets and up */
          md:max-w-xl
          /* Smooth transitions */
          transition-all duration-200
        ">
          <AlertDialogHeader>
            <AlertDialogTitle className="
              text-lg font-semibold
              sm:text-xl
              lg:text-2xl
            ">
              Delete Response
            </AlertDialogTitle>
            <AlertDialogDescription className="
              text-sm text-muted-foreground mt-2
              sm:text-base
              lg:text-lg
            ">
              Are you sure you want to delete this response? This action cannot be undone and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="
            /* Mobile - Stacked */
            flex flex-col gap-3 mt-6
            /* Tablet and up - Row */
            sm:flex-row sm:gap-4 sm:mt-8
          ">
            <AlertDialogCancel 
              className="
                w-full cursor-pointer order-2 mt-2
                sm:w-auto sm:order-1 sm:mt-0
                transition-all duration-200
              "
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
              }}
              disabled={isDeleting}
              className="
                w-full cursor-pointer order-1
                sm:w-auto sm:order-2
                bg-red-600 hover:bg-red-700 focus:bg-red-700
                transition-all duration-200 transform hover:scale-[1.02]
              "
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="sm:hidden">Deleting...</span>
                  <span className="hidden sm:inline">Deleting Response...</span>
                </>
              ) : (
                "Delete Response"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}