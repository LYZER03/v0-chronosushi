"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, ChevronDown, ChevronUp, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SectionEditor } from "@/components/section-editor"
import type { Section } from "@/lib/page-builder"

interface SortableSectionProps {
  section: Section
  onUpdate: (section: Section) => void
  onDelete: () => void
  allSections?: Section[]
}

export function SortableSection({ section, onUpdate, onDelete, allSections = [] }: SortableSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getSectionTypeLabel = (type: string) => {
    switch (type) {
      case "hero":
        return "Hero"
      case "text-image":
        return "Text with Image"
      case "testimonials":
        return "Testimonials"
      case "product-grid":
        return "Product Grid"
      case "contact-cta":
        return "Contact CTA"
      case "accordion-sidebar":
        return "Accordion Sidebar"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="relative">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </Button>
          <div className="font-medium">{getSectionTypeLabel(section.type)}</div>
          {section.type === "hero" && section.heading && (
            <div className="text-sm text-muted-foreground">{section.heading}</div>
          )}
          {section.type === "text-image" && section.title && (
            <div className="text-sm text-muted-foreground">{section.title}</div>
          )}
          {section.type === "testimonials" && section.title && (
            <div className="text-sm text-muted-foreground">{section.title}</div>
          )}
          {section.type === "product-grid" && section.title && (
            <div className="text-sm text-muted-foreground">{section.title}</div>
          )}
          {section.type === "contact-cta" && section.heading && (
            <div className="text-sm text-muted-foreground">{section.heading}</div>
          )}
          {section.type === "accordion-sidebar" && section.title && (
            <div className="text-sm text-muted-foreground">{section.title}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0">
            <SectionEditor section={section} onUpdate={onUpdate} allSections={allSections} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
