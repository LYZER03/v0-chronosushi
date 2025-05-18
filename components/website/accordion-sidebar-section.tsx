"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

interface AccordionSidebarSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function AccordionSidebarSection({
  title,
  children,
  defaultOpen = true,
  className,
}: AccordionSidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn("border-b border-gray-200 dark:border-gray-700", className)}>
      <Button
        variant="ghost"
        className="w-full justify-between px-4 py-3 text-left font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
