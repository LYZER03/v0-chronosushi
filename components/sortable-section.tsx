"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SectionEditor } from "@/components/section-editor"
import type { Section } from "@/lib/page-builder"

interface SortableSectionProps {
  section: Section
  onUpdate: (section: Section) => void
  onDelete: () => void
}

export function SortableSection({ section, onUpdate, onDelete }: SortableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getSectionTypeLabel = (type: Section["type"]) => {
    switch (type) {
      case "hero":
        return "Hero Banner"
      case "text-image":
        return "Text & Image"
      case "testimonials":
        return "Testimonials"
      case "product-grid":
        return "Product Grid"
      case "contact-cta":
        return "Contact CTA"
      default:
        return "Section"
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="border-2 border-dashed border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="cursor-grab" {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div>
            <h4 className="text-sm font-medium">{section.title || getSectionTypeLabel(section.type)}</h4>
            <p className="text-xs text-muted-foreground">{getSectionTypeLabel(section.type)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete()}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-3 pt-0">
          <SectionEditor section={section} onUpdate={onUpdate} />
        </CardContent>
      )}
    </Card>
  )
}
