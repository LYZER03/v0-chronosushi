"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { AccordionSidebarSection as AccordionSidebarSectionType } from "@/lib/page-builder"

interface AccordionSidebarSectionProps {
  section: AccordionSidebarSectionType
  allSectionIds: Record<string, string>
}

export function AccordionSidebarSection({ section, allSectionIds }: AccordionSidebarSectionProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(
    section.categories.length > 0 ? section.categories[0].id : null,
  )

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleSubcategoryClick = (targetSectionId: string) => {
    if (!targetSectionId) return

    const targetElement = document.getElementById(allSectionIds[targetSectionId])

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })

      // Close mobile menu if open
      if (isMobile) {
        setMobileOpen(false)
      }
    }
  }

  // Mobile dropdown version
  if (isMobile && section.mobileDisplayMode === "dropdown") {
    return (
      <div className="mb-8 w-full">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{section.title}</h2>
        </div>

        <div className="relative">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            <span>Browse Categories</span>
            {mobileOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {mobileOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
              {section.categories.map((category) => (
                <div key={category.id} className="border-b border-gray-200 last:border-b-0">
                  <div className="px-4 py-2 font-medium">{category.name}</div>
                  <div className="bg-gray-50 px-4 py-1">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        className="block w-full py-2 text-left text-sm hover:text-blue-600"
                        onClick={() => handleSubcategoryClick(subcategory.targetSectionId)}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Mobile collapsible version
  if (isMobile) {
    return (
      <div className="mb-8 w-full">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{section.title}</h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {section.categories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="text-base font-medium">{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-2 pt-2">
                  {category.subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      className="block w-full text-left text-sm hover:text-blue-600"
                      onClick={() => handleSubcategoryClick(subcategory.targetSectionId)}
                    >
                      {subcategory.name}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  }

  // Desktop version
  return (
    <div className={cn("w-full md:w-64", section.stickyOnDesktop && "md:sticky md:top-4 md:self-start")}>
      <div className="mb-4">
        <h2 className="text-xl font-bold">{section.title}</h2>
      </div>

      <div className="space-y-4">
        {section.categories.map((category) => (
          <div key={category.id} className="rounded-md border border-gray-200">
            <div
              className={cn(
                "cursor-pointer rounded-t-md px-4 py-2 font-medium",
                activeCategory === category.id ? "bg-gray-100" : "bg-white",
              )}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              <div className="flex items-center justify-between">
                <span>{category.name}</span>
                {activeCategory === category.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>

            {activeCategory === category.id && (
              <div className="space-y-1 border-t border-gray-200 bg-white p-2">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    className="block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-gray-100"
                    onClick={() => handleSubcategoryClick(subcategory.targetSectionId)}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
