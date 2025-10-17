"use client"

import type { FormField } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface FieldEditorProps {
  field: FormField
  onUpdate: (field: FormField) => void
}

export function FieldEditor({ field, onUpdate }: FieldEditorProps) {
  const hasOptions = field.field_type === "select" || field.field_type === "radio" || field.field_type === "checkbox"

  const addOption = () => {
    const options = field.options || []
    onUpdate({ ...field, options: [...options, `Option ${options.length + 1}`] })
  }

  const updateOption = (index: number, value: string) => {
    const options = [...(field.options || [])]
    options[index] = value
    onUpdate({ ...field, options })
  }

  const removeOption = (index: number) => {
    const options = [...(field.options || [])]
    options.splice(index, 1)
    onUpdate({ ...field, options })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Properties</CardTitle>
        <CardDescription>Configure the selected field</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="field-label">Label</Label>
          <Input id="field-label" value={field.label} onChange={(e) => onUpdate({ ...field, label: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ ...field, placeholder: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required</Label>
          <Switch
            id="field-required"
            checked={field.required}
            onCheckedChange={(checked) => onUpdate({ ...field, required: checked })}
          />
        </div>

        {hasOptions && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {(field.options || []).map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeOption(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption} className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        {(field.field_type === "text" || field.field_type === "textarea") && (
          <div className="space-y-2">
            <Label htmlFor="field-minlength">Min Length</Label>
            <Input
              id="field-minlength"
              type="number"
              value={field.validation?.minLength || ""}
              onChange={(e) =>
                onUpdate({
                  ...field,
                  validation: { ...field.validation, minLength: Number.parseInt(e.target.value) || undefined },
                })
              }
            />
          </div>
        )}

        {(field.field_type === "text" || field.field_type === "textarea") && (
          <div className="space-y-2">
            <Label htmlFor="field-maxlength">Max Length</Label>
            <Input
              id="field-maxlength"
              type="number"
              value={field.validation?.maxLength || ""}
              onChange={(e) =>
                onUpdate({
                  ...field,
                  validation: { ...field.validation, maxLength: Number.parseInt(e.target.value) || undefined },
                })
              }
            />
          </div>
        )}

        {field.field_type === "number" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="field-min">Min Value</Label>
              <Input
                id="field-min"
                type="number"
                value={field.validation?.min || ""}
                onChange={(e) =>
                  onUpdate({
                    ...field,
                    validation: { ...field.validation, min: Number.parseInt(e.target.value) || undefined },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-max">Max Value</Label>
              <Input
                id="field-max"
                type="number"
                value={field.validation?.max || ""}
                onChange={(e) =>
                  onUpdate({
                    ...field,
                    validation: { ...field.validation, max: Number.parseInt(e.target.value) || undefined },
                  })
                }
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
