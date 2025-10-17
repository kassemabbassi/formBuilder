"use client"

import { useState } from "react"
import type { Event, FormField, FieldType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { FieldTypeSelector } from "./field-type-selector"
import { FieldsList } from "./fields-list"
import { FieldEditor } from "./field-editor"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface FormBuilderProps {
  event: Event
  initialFields: FormField[]
}

export function FormBuilder({ event, initialFields }: FormBuilderProps) {
  const [eventData, setEventData] = useState(event)
  const [fields, setFields] = useState<FormField[]>(initialFields)
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const { toast } = useToast()

  const addField = (fieldType: FieldType) => {
    const newField: FormField = {
      id: `temp-${Date.now()}`,
      event_id: event.id,
      field_type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: "",
      required: false,
      options: fieldType === "select" || fieldType === "radio" || fieldType === "checkbox" ? ["Option 1"] : undefined,
      validation: {},
      order_index: fields.length,
      created_at: new Date().toISOString(),
    }
    setFields([...fields, newField])
    setSelectedField(newField)
  }

  const updateField = (updatedField: FormField) => {
    setFields(fields.map((f) => (f.id === updatedField.id ? updatedField : f)))
    setSelectedField(updatedField)
  }

  const deleteField = (fieldId: string) => {
    setFields(fields.filter((f) => f.id !== fieldId))
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  const reorderFields = (startIndex: number, endIndex: number) => {
    const result = Array.from(fields)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    const reordered = result.map((field, index) => ({ ...field, order_index: index }))
    setFields(reordered)
  }

  const handleSave = async () => {
    setSaving(true)

    // Update event details
    await supabase
      .from("events")
      .update({
        title: eventData.title,
        description: eventData.description,
        is_active: eventData.is_active,
      })
      .eq("id", event.id)

    // Delete all existing fields
    await supabase.from("form_fields").delete().eq("event_id", event.id)

    // Insert new fields
    const fieldsToInsert = fields.map((field) => ({
      event_id: event.id,
      field_type: field.field_type,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      options: field.options,
      validation: field.validation,
      order_index: field.order_index,
    }))

    if (fieldsToInsert.length > 0) {
      await supabase.from("form_fields").insert(fieldsToInsert)
    }

    toast({
      title: "Saved successfully",
      description: "Your form has been updated.",
    })

    setSaving(false)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/f/${event.slug}`} target="_blank">
              <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Event Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
                <CardDescription>Configure your event details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    className="border-primary/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={eventData.description || ""}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    rows={3}
                    className="border-primary/20 focus:border-primary/50"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="event-active">Active</Label>
                  <Switch
                    id="event-active"
                    checked={eventData.is_active}
                    onCheckedChange={(checked) => setEventData({ ...eventData, is_active: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Form URL</Label>
                  <div className="rounded-md bg-muted/50 p-3 text-sm border border-primary/10">
                    <code className="break-all text-primary">/f/{event.slug}</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
              <CardHeader>
                <CardTitle>Add Fields</CardTitle>
                <CardDescription>Drag and drop field types to build your form</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldTypeSelector onSelectType={addField} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
              <CardHeader>
                <CardTitle>Form Fields</CardTitle>
                <CardDescription>Manage and reorder your form fields</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldsList
                  fields={fields}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                  onReorder={reorderFields}
                  onDelete={deleteField}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Field Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="lg:col-span-1"
          >
            {selectedField ? (
              <FieldEditor field={selectedField} onUpdate={updateField} />
            ) : (
              <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
                <CardContent className="flex min-h-[400px] items-center justify-center">
                  <p className="text-center text-muted-foreground">Select a field to edit its properties</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
