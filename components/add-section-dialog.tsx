"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LayoutGrid, ImageIcon, MessageSquareQuote, ShoppingBag, PhoneCall, AlignLeft } from "lucide-react"
import type { SectionType } from "@/lib/page-builder"

interface AddSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddSection: (sectionType: SectionType) => void
}

interface SectionOption {
  type: SectionType
  label: string
  description: string
  icon: React.ElementType
}

const sectionOptions: SectionOption[] = [
  {
    type: "hero",
    label: "Hero",
    description: "A large banner with heading, subheading, and background image",
    icon: LayoutGrid,
  },
  {
    type: "text-image",
    label: "Text with Image",
    description: "Text content with an accompanying image",
    icon: ImageIcon,
  },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Customer reviews and testimonials",
    icon: MessageSquareQuote,
  },
  {
    type: "product-grid",
    label: "Product Grid",
    description: "Display products in a grid layout",
    icon: ShoppingBag,
  },
  {
    type: "contact-cta",
    label: "Contact CTA",
    description: "Call-to-action section for contact or reservation",
    icon: PhoneCall,
  },
  {
    type: "accordion-sidebar",
    label: "Accordion Sidebar",
    description: "Sidebar with expandable categories and subcategories",
    icon: AlignLeft,
  },
]

export function AddSectionDialog({ open, onOpenChange, onAddSection }: AddSectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sectionOptions.map((option) => (
            <Button
              key={option.type}
              variant="outline"
              className="flex h-auto flex-col items-start gap-2 p-4 text-left"
              onClick={() => onAddSection(option.type)}
            >
              <div className="flex w-full items-center gap-2">
                <option.icon className="h-5 w-5" />
                <span className="font-medium">{option.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
