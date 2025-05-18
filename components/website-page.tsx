"use client"

import { useState, useEffect } from "react"
import type { Page } from "@/lib/page-builder"
import { AccordionSidebarSection } from "@/components/website/accordion-sidebar-section"
import { RenderSection } from "@/components/website/render-section"

interface WebsitePageProps {
  page: Page
}

export function WebsitePage({ page }: WebsitePageProps) {
  const [selectedProducts, setSelectedProducts] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  // Fetch products for product grid sections
  const fetchProductsForSection = async (sectionId: string, productIds: string[]) => {
    if (!productIds.length) return []

    setLoading((prev) => ({ ...prev, [sectionId]: true }))

    try {
      const response = await fetch(`/api/products?ids=${productIds.join(",")}`)
      if (!response.ok) throw new Error("Failed to fetch products")

      const products = await response.json()

      setSelectedProducts((prev) => ({
        ...prev,
        [sectionId]: products,
      }))

      return products
    } catch (error) {
      console.error("Error fetching products:", error)
      return []
    } finally {
      setLoading((prev) => ({ ...prev, [sectionId]: false }))
    }
  }

  // Fetch products for all product grid sections on mount
  useEffect(() => {
    page.sections.forEach((section) => {
      if (section.type === "product-grid" && section.productIds.length > 0) {
        fetchProductsForSection(section.id, section.productIds)
      }
    })
  }, [page.sections])

  // Find sections with accordion-sidebar type
  const sidebarSections = page.sections.filter((section) => section.type === "accordion-sidebar")
  const contentSections = page.sections.filter((section) => section.type !== "accordion-sidebar")

  return (
    <div className="mx-auto max-w-7xl">
      {sidebarSections.length > 0 && contentSections.length > 0 ? (
        <div className="flex flex-col md:flex-row">
          {/* Render sidebar sections */}
          <div className="w-full md:w-1/4 md:max-w-[250px] p-4">
            {sidebarSections.map((section) => (
              <AccordionSidebarSection key={section.id} section={section} />
            ))}
          </div>

          {/* Render content sections */}
          <div className="flex-1 p-4">
            {contentSections.map((section) => (
              <RenderSection
                key={section.id}
                section={section}
                products={selectedProducts[section.id] || []}
                loading={loading[section.id] || false}
              />
            ))}
          </div>
        </div>
      ) : (
        // If no sidebar sections, render all sections normally
        <div className="p-4">
          {page.sections.map((section) => (
            <RenderSection
              key={section.id}
              section={section}
              products={selectedProducts[section.id] || []}
              loading={loading[section.id] || false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
