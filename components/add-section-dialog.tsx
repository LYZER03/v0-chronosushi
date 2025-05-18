"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, ImageIcon, MessageSquareQuote, ShoppingBag, Phone, Menu } from "lucide-react"
import type { SectionType } from "@/lib/page-builder"

interface AddSectionDialogProps {
  onAddSection: (sectionType: SectionType) => void
}

export function AddSectionDialog({ onAddSection }: AddSectionDialogProps) {
  const [open, setOpen] = useState(false)

  const handleAddSection = (sectionType: SectionType) => {
    onAddSection(sectionType)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <SectionOption
            icon={<LayoutGrid className="h-10 w-10" />}
            title="Hero"
            description="Large banner with heading, subheading, and optional CTA"
            onClick={() => handleAddSection("hero")}
          />
          <SectionOption
            icon={<ImageIcon className="h-10 w-10" />}
            title="Text with Image"
            description="Text content with an image on the left or right"
            onClick={() => handleAddSection("text-image")}
          />
          <SectionOption
            icon={<MessageSquareQuote className="h-10 w-10" />}
            title="Testimonials"
            description="Customer testimonials with ratings"
            onClick={() => handleAddSection("testimonials")}
          />
          <SectionOption
            icon={<ShoppingBag className="h-10 w-10" />}
            title="Product Grid"
            description="Grid of products with images and details"
            onClick={() => handleAddSection("product-grid")}
          />
          <SectionOption
            icon={<Phone className="h-10 w-10" />}
            title="Contact CTA"
            description="Call-to-action section with button"
            onClick={() => handleAddSection("contact-cta")}
          />
          <SectionOption
            icon={<Menu className="h-10 w-10" />}
            title="Accordion Sidebar"
            description="Sidebar with expandable categories linked to product sections"
            onClick={() => handleAddSection("accordion-sidebar")}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SectionOptionProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

function SectionOption({ icon, title, description, onClick }: SectionOptionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center rounded-lg border border-muted p-4 text-center transition-colors hover:bg-muted/50"
    >
      <div className="mb-2 text-primary">{icon}</div>
      <h3 className="mb-1 text-sm font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  )
}
