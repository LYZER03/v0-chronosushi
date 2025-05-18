"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { AccordionSidebarSection as AccordionSidebarSectionType } from "@/lib/page-builder"

interface AccordionSidebarSectionProps {
  section: AccordionSidebarSectionType
  allSectionIds?: Record<string, string>
  className?: string
}

export function AccordionSidebarSection({
  section,
  allSectionIds = {},
  className,
}: AccordionSidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSubcategoryClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
      
      // Close the mobile menu after clicking a link
      if (isMobile) {
        setIsOpen(false)
      }
    }
  }

  // For mobile dropdown mode
  if (isMobile && section.mobileDisplayMode === 'dropdown') {
    return (
      <div className={cn("mb-4", className)}>
        <select 
          className="w-full rounded-md border border-gray-300 p-2 text-sm"
          onChange={(e) => {
            const targetId = e.target.value
            if (targetId) {
              const targetElement = document.getElementById(targetId)
              targetElement?.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          <option value="">Select a category</option>
          {section.categories.map((category) => (
            <optgroup key={category.id} label={category.name}>
              {category.subcategories.map((subcategory) => (
                <option 
                  key={subcategory.id} 
                  value={subcategory.targetSectionId}
                >
                  {subcategory.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    )
  }

  // Default accordion view
  return (
    <div 
      className={cn(
        "border-b border-gray-200 dark:border-gray-700",
        section.stickyOnDesktop && "md:sticky md:top-4",
        className
      )}
    >
      <Button
        variant="ghost"
        className="w-full justify-between px-4 py-3 text-left font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{section.title || 'Categories'}</span>
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
        <div className="p-4">
          {section.categories.map((category) => (
            <div key={category.id} className="mb-4 last:mb-0">
              <h4 className="mb-2 font-medium">{category.name}</h4>
              <div className="flex flex-col space-y-1 pl-2">
                {category.subcategories.map((subcategory) => (
                  <a
                    key={subcategory.id}
                    href={`#${subcategory.targetSectionId}`}
                    onClick={(e) => handleSubcategoryClick(e, subcategory.targetSectionId)}
                    className="py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {subcategory.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
