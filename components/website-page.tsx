import { Fragment } from "react"
import { RenderSection } from "@/components/website/render-section"
import { AccordionSidebarSection } from "@/components/website/accordion-sidebar-section"
import type { Page, Section } from "@/lib/page-builder"
import { getProductsByIds } from "@/lib/products"
import { cn } from "@/lib/utils"

interface WebsitePageProps {
  page: Page
}

export async function WebsitePage({ page }: WebsitePageProps) {
  // Create a mapping of section IDs to HTML IDs for smooth scrolling
  const sectionIds: Record<string, string> = {}
  page.sections.forEach((section) => {
    // For product grid sections, use the section ID as is
    // For other sections, prefix with 'section-'
    sectionIds[section.id] = section.type === 'product-grid' 
      ? section.id 
      : `section-${section.id}`
  })

  // Find accordion sidebar sections and product grid sections
  const accordionSidebarSections = page.sections.filter((section) => section.type === "accordion-sidebar")
  const otherSections = page.sections.filter((section) => section.type !== "accordion-sidebar")

  // If there are no accordion sidebar sections, render all sections normally
  if (accordionSidebarSections.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {page.sections.map((section) => (
          <div key={section.id} id={sectionIds[section.id]} className="mb-12 last:mb-0">
            <RenderSection section={section} allSectionIds={sectionIds} />
          </div>
        ))}
      </div>
    )
  }

  // Collect all product IDs from product-grid sections
  const productGridSections = page.sections.filter(
    (section): section is Section & { type: 'product-grid'; productIds: string[] } => 
      section.type === 'product-grid' && 
      'productIds' in section && 
      Array.isArray(section.productIds) && 
      section.productIds.length > 0
  )
  
  const allProductIds = Array.from(new Set(
    productGridSections.flatMap(section => section.productIds)
  ))

  // Fetch all products needed for product-grid sections
  const products = allProductIds.length > 0 ? await getProductsByIds(allProductIds) : []
  const productsById = new Map(products.map(product => [product.id, product]))

  // If there are accordion sidebar sections, render them alongside other sections
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {accordionSidebarSections.map((accordionSection, index) => {
        // Find the next accordion section (if any)
        const nextAccordionIndex = accordionSidebarSections.findIndex(
          (s, i) => i > index && s.type === "accordion-sidebar",
        )

        // Get sections between this accordion and the next one (or the end)
        const sectionsBetween =
          nextAccordionIndex !== -1
            ? otherSections.slice(
                otherSections.findIndex((s) => s.id === accordionSection.id) + 1,
                otherSections.findIndex((s) => s.id === accordionSidebarSections[nextAccordionIndex].id),
              )
            : otherSections.slice(otherSections.findIndex((s) => s.id === accordionSection.id) + 1)

        return (
          <Fragment key={accordionSection.id}>
            <div className="mb-12 flex flex-col gap-8 md:flex-row">
              <div className={cn(
                "w-full md:w-1/4",
                accordionSection.stickyOnDesktop && "md:sticky md:top-4 md:self-start"
              )}>
                <AccordionSidebarSection 
                  section={{
                    ...accordionSection,
                    // Ensure the section has a title
                    title: accordionSection.title || 'Categories'
                  }} 
                  allSectionIds={sectionIds} 
                />
              </div>
              <div className="w-full md:w-3/4">
                {sectionsBetween.map((section) => {
                  // For product-grid sections, filter products by the section's productIds
                  const sectionProducts = section.type === 'product-grid' && 'productIds' in section && Array.isArray(section.productIds)
                    ? section.productIds.map(id => productsById.get(id)).filter(Boolean)
                    : []
                    
                  return (
                    <div key={section.id} id={sectionIds[section.id]} className="mb-12 last:mb-0">
                      <RenderSection 
                        section={section} 
                        allSectionIds={sectionIds}
                        products={sectionProducts}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
