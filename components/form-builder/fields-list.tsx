"use client"

import type { FormField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { GripVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FieldsListProps {
  fields: FormField[]
  selectedField: FormField | null
  onSelectField: (field: FormField) => void
  onReorder: (startIndex: number, endIndex: number) => void
  onDelete: (fieldId: string) => void
}

export function FieldsList({ fields, selectedField, onSelectField, onReorder, onDelete }: FieldsListProps) {
  if (fields.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-center text-sm text-muted-foreground">No fields yet. Add fields from the left panel.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className={cn(
            "flex items-center gap-2 rounded-lg border p-3 transition-colors",
            selectedField?.id === field.id ? "border-primary bg-primary/5" : "hover:bg-muted/50",
          )}
        >
          <Button variant="ghost" size="icon" className="h-6 w-6 cursor-grab" onMouseDown={(e) => e.preventDefault()}>
            <GripVertical className="h-4 w-4" />
          </Button>
          <div className="flex-1 cursor-pointer" onClick={() => onSelectField(field)}>
            <p className="text-sm font-medium">{field.label}</p>
            <p className="text-xs text-muted-foreground">
              {field.field_type} {field.required && "• Required"}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(field.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  )
}
