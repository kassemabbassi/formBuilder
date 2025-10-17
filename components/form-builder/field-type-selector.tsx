"use client"

import type React from "react"

import type { FieldType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Type,
  Mail,
  Hash,
  Phone,
  AlignLeft,
  List,
  Circle,
  CheckSquare,
  Calendar,
  Clock,
  LinkIcon,
  Upload,
  Star,
  Sliders,
  Palette,
  CalendarClock,
  CalendarRange,
  Lock,
  ListChecks,
  ToggleLeft,
  BarChart3,
  Grid3x3,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FieldTypeSelectorProps {
  onSelectType: (type: FieldType) => void
}

const fieldTypes: { type: FieldType; label: string; icon: React.ReactNode; category: string }[] = [
  { type: "text", label: "Text", icon: <Type className="h-4 w-4" />, category: "Basic" },
  { type: "email", label: "Email", icon: <Mail className="h-4 w-4" />, category: "Basic" },
  { type: "number", label: "Number", icon: <Hash className="h-4 w-4" />, category: "Basic" },
  { type: "tel", label: "Phone", icon: <Phone className="h-4 w-4" />, category: "Basic" },
  { type: "url", label: "URL", icon: <LinkIcon className="h-4 w-4" />, category: "Basic" },
  { type: "password", label: "Password", icon: <Lock className="h-4 w-4" />, category: "Basic" },
  { type: "textarea", label: "Text Area", icon: <AlignLeft className="h-4 w-4" />, category: "Text" },
  { type: "select", label: "Dropdown", icon: <List className="h-4 w-4" />, category: "Choice" },
  { type: "multiselect", label: "Multi Select", icon: <ListChecks className="h-4 w-4" />, category: "Choice" },
  { type: "radio", label: "Radio", icon: <Circle className="h-4 w-4" />, category: "Choice" },
  { type: "checkbox", label: "Checkbox", icon: <CheckSquare className="h-4 w-4" />, category: "Choice" },
  { type: "yesno", label: "Yes/No", icon: <ToggleLeft className="h-4 w-4" />, category: "Choice" },
  { type: "date", label: "Date", icon: <Calendar className="h-4 w-4" />, category: "Date & Time" },
  { type: "time", label: "Time", icon: <Clock className="h-4 w-4" />, category: "Date & Time" },
  { type: "datetime", label: "Date & Time", icon: <CalendarClock className="h-4 w-4" />, category: "Date & Time" },
  { type: "month", label: "Month", icon: <CalendarRange className="h-4 w-4" />, category: "Date & Time" },
  { type: "week", label: "Week", icon: <CalendarRange className="h-4 w-4" />, category: "Date & Time" },
  { type: "file", label: "File Upload", icon: <Upload className="h-4 w-4" />, category: "Advanced" },
  { type: "rating", label: "Rating", icon: <Star className="h-4 w-4" />, category: "Advanced" },
  { type: "slider", label: "Slider", icon: <Sliders className="h-4 w-4" />, category: "Advanced" },
  { type: "range", label: "Range", icon: <Sliders className="h-4 w-4" />, category: "Advanced" },
  { type: "color", label: "Color Picker", icon: <Palette className="h-4 w-4" />, category: "Advanced" },
  { type: "scale", label: "Scale (1-10)", icon: <BarChart3 className="h-4 w-4" />, category: "Advanced" },
  { type: "matrix", label: "Matrix", icon: <Grid3x3 className="h-4 w-4" />, category: "Advanced" },
]

const categories = ["Basic", "Text", "Choice", "Date & Time", "Advanced"]

export function FieldTypeSelector({ onSelectType }: FieldTypeSelectorProps) {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{category}</h3>
            <div className="grid grid-cols-2 gap-2">
              {fieldTypes
                .filter((ft) => ft.category === category)
                .map((fieldType) => (
                  <Button
                    key={fieldType.type}
                    variant="outline"
                    className="justify-start cursor-pointer bg-transparent hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={() => onSelectType(fieldType.type)}
                  >
                    {fieldType.icon}
                    <span className="ml-2 text-sm">{fieldType.label}</span>
                  </Button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
