"use client"

import type { FormField } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Star } from "lucide-react"
import { useState } from "react"

interface FormFieldRendererProps {
  field: FormField
  value: string
  error?: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function FormFieldRenderer({ field, value, error, onChange, disabled }: FormFieldRendererProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const renderField = () => {
    switch (field.field_type) {
      case "text":
      case "email":
      case "number":
      case "tel":
      case "url":
        return (
          <Input
            type={field.field_type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={error ? "border-destructive" : ""}
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            rows={4}
            className={error ? "border-destructive" : ""}
          />
        )

      case "select":
        return (
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`} className="font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        const selectedValues = value ? value.split(",") : []
        const handleCheckboxChange = (option: string, checked: boolean) => {
          let newValues = [...selectedValues]
          if (checked) {
            newValues.push(option)
          } else {
            newValues = newValues.filter((v) => v !== option)
          }
          onChange(newValues.join(","))
        }

        return (
          <div className="space-y-2">
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                  disabled={disabled}
                />
                <Label htmlFor={`${field.id}-${index}`} className="font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={error ? "border-destructive" : ""}
          />
        )

      case "time":
        return (
          <Input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={error ? "border-destructive" : ""}
          />
        )

      case "yesno":
        return (
          <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${field.id}-yes`} />
              <Label htmlFor={`${field.id}-yes`} className="font-normal cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${field.id}-no`} />
              <Label htmlFor={`${field.id}-no`} className="font-normal cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        )

      case "color":
        return (
          <div className="flex items-center gap-4">
            <Input
              type="color"
              value={value || "#3b82f6"}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={`h-12 w-24 cursor-pointer ${error ? "border-destructive" : ""}`}
            />
            <Input
              type="text"
              value={value || "#3b82f6"}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder="#000000"
              className={error ? "border-destructive" : ""}
            />
          </div>
        )

      case "rating":
        const maxRating = 5
        const currentRating = Number.parseInt(value) || 0
        return (
          <div className="flex items-center gap-2">
            {[...Array(maxRating)].map((_, index) => {
              const ratingValue = index + 1
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onChange(ratingValue.toString())}
                  onMouseEnter={() => setHoverRating(ratingValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={disabled}
                  className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed"
                >
                  <Star
                    className={`h-8 w-8 ${
                      ratingValue <= (hoverRating || currentRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              )
            })}
            {currentRating > 0 && (
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                {currentRating} / {maxRating}
              </span>
            )}
          </div>
        )

      case "slider":
      case "scale":
        const sliderValue = Number.parseInt(value) || 0
        const min = field.validation?.min || 0
        const max = field.validation?.max || 10
        return (
          <div className="space-y-4">
            <Slider
              value={[sliderValue]}
              onValueChange={(values) => onChange(values[0].toString())}
              min={min}
              max={max}
              step={1}
              disabled={disabled}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{min}</span>
              <span className="font-semibold text-primary">{sliderValue}</span>
              <span>{max}</span>
            </div>
          </div>
        )

      case "file":
        return (
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                onChange(file.name)
              }
            }}
            disabled={disabled}
            className={`cursor-pointer ${error ? "border-destructive" : ""}`}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-base">
        {field.label}
        {field.required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
