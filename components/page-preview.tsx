"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Page, Section } from "@/lib/page-builder"

interface PagePreviewProps {
  page: Page
}

export function PagePreview({ page }: PagePreviewProps) {
  const [selectedProducts, setSelectedProducts] = useState<Record<string, any[]>>({})

  // Simulate fetching products for product grid sections
  const fetchProductsForSection = async (sectionId: string, productIds: string[]) => {
    // In a real app, this would fetch from an API
    const mockProducts = productIds.map((id) => ({
      id,
      name: `Product ${id.slice(0, 5)}`,
      price: Math.floor(Math.random() * 100) + 9.99,
      image: `/placeholder.svg?height=200&width=200&text=Product`,
    }))

    setSelectedProducts((prev) => ({
      ...prev,
      [sectionId]: mockProducts,
    }))

    return mockProducts
  }

  // Fetch products for all product grid sections on mount
  useState(() => {
    page.sections.forEach((section) => {
      if (section.type === "product-grid" && section.productIds.length > 0) {
        fetchProductsForSection(section.id, section.productIds)
      }
    })
  })

  // Find sections with accordion-sidebar type
  const sidebarSections = page.sections.filter((section) => section.type === "accordion-sidebar")
  const contentSections = page.sections.filter((section) => section.type !== "accordion-sidebar")

  return (
    <div className="flex flex-col">
      {sidebarSections.length > 0 && contentSections.length > 0 ? (
        <div className="flex flex-col md:flex-row">
          {/* Render sidebar sections */}
          <div className="w-full md:w-1/4 md:max-w-[250px] p-4">
            {sidebarSections.map((section) => (
              <PreviewAccordionSidebar key={section.id} section={section} />
            ))}
          </div>

          {/* Render content sections */}
          <div className="flex-1 p-4">
            {contentSections.map((section) => (
              <PreviewSection
                key={section.id}
                section={section}
                products={selectedProducts[section.id] || []}
                onFetchProducts={
                  section.type === "product-grid"
                    ? () =>
                        fetchProductsForSection(section.id, section.type === "product-grid" ? section.productIds : [])
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      ) : (
        // If no sidebar sections, render all sections normally
        <div className="p-4">
          {page.sections.map((section) => (
            <PreviewSection
              key={section.id}
              section={section}
              products={selectedProducts[section.id] || []}
              onFetchProducts={
                section.type === "product-grid"
                  ? () => fetchProductsForSection(section.id, section.type === "product-grid" ? section.productIds : [])
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PreviewSection({
  section,
  products,
  onFetchProducts,
}: {
  section: Section
  products: any[]
  onFetchProducts?: () => Promise<any[]>
}) {
  switch (section.type) {
    case "hero":
      return <PreviewHeroSection section={section} />
    case "text-image":
      return <PreviewTextImageSection section={section} />
    case "testimonials":
      return <PreviewTestimonialsSection section={section} />
    case "product-grid":
      return <PreviewProductGridSection section={section} products={products} onFetchProducts={onFetchProducts} />
    case "contact-cta":
      return <PreviewContactCTASection section={section} />
    case "accordion-sidebar":
      return <PreviewAccordionSidebar section={section} />
    default:
      return null
  }
}

function PreviewHeroSection({ section }: { section: Section & { type: "hero" } }) {
  return (
    <div className="relative mb-8 h-[300px] w-full overflow-hidden rounded-lg bg-gray-100">
      {section.imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={section.imageUrl || "/placeholder.svg"}
            alt={section.heading}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-6 text-center text-white">
        <h1 className="mb-2 text-3xl font-bold">{section.heading}</h1>
        <p className="text-lg">{section.subheading}</p>
      </div>
    </div>
  )
}

function PreviewTextImageSection({ section }: { section: Section & { type: "text-image" } }) {
  return (
    <div className="mb-8">
      <div
        className={`flex flex-col gap-6 ${section.imagePosition === "right" ? "md:flex-row" : "md:flex-row-reverse"}`}
      >
        <div className="flex flex-1 flex-col justify-center">
          <h2 className="mb-4 text-2xl font-bold">{section.title}</h2>
          <p className="text-gray-600">{section.text}</p>
        </div>
        <div className="flex-1">
          <div className="relative h-[250px] w-full overflow-hidden rounded-lg">
            <Image
              src={section.imageUrl || "/placeholder.svg"}
              alt={section.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewTestimonialsSection({ section }: { section: Section & { type: "testimonials" } }) {
  return (
    <div className="mb-8">
      <h2 className="mb-6 text-center text-2xl font-bold">{section.title}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {section.testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center">
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="mb-2 text-gray-600">{testimonial.content}</p>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PreviewProductGridSection({
  section,
  products,
  onFetchProducts,
}: {
  section: Section & { type: "product-grid" }
  products: any[]
  onFetchProducts?: () => Promise<any[]>
}) {
  const [loading, setLoading] = useState(false)

  const handleLoadProducts = async () => {
    if (!onFetchProducts) return
    setLoading(true)
    await onFetchProducts()
    setLoading(false)
  }

  // Use an ID for the section to enable smooth scrolling
  return (
    <div className="mb-8" id={section.id}>
      <h2 className="mb-2 text-2xl font-bold">{section.title}</h2>
      <p className="mb-6 text-gray-600">{section.subtitle}</p>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="mb-4 text-gray-500">No products selected</p>
          <Button onClick={handleLoadProducts} disabled={loading}>
            {loading ? "Loading..." : "Load Sample Products"}
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="relative mb-3 h-[150px] w-full overflow-hidden rounded-md">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3 className="font-medium">{product.name}</h3>
                {section.showPrices && <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function PreviewContactCTASection({ section }: { section: Section & { type: "contact-cta" } }) {
  return (
    <div className="mb-8 rounded-lg bg-gray-100 p-8 text-center">
      <h2 className="mb-2 text-2xl font-bold">{section.heading}</h2>
      <p className="mb-6 text-gray-600">{section.subheading}</p>
      <Button>{section.buttonText}</Button>
    </div>
  )
}

function PreviewAccordionSidebar({ section }: { section: Section & { type: "accordion-sidebar" } }) {
  return (
    <div className={`mb-8 ${section.stickyOnDesktop ? "md:sticky md:top-4" : ""}`}>
      <h3 className="mb-4 font-medium">{section.title}</h3>

      {section.mobileDisplayMode === "dropdown" && (
        <div className="mb-4 block md:hidden">
          <Button variant="outline" className="w-full justify-between">
            <span>Select Category</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Accordion type="multiple" className="w-full">
        {section.categories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="text-sm font-medium">{category.name}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-1 pl-2">
                {category.subcategories.map((subcategory) => (
                  <a
                    key={subcategory.id}
                    href={`#${subcategory.targetSectionId}`}
                    className="py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {subcategory.name}
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
