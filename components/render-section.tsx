"use client"
import { HeroSection } from "@/components/website/hero-section"
import { TextImageSection } from "@/components/website/text-image-section"
import { TestimonialsSection } from "@/components/website/testimonials-section"
import { ProductGridSection } from "@/components/product-grid-section"
import { ContactCTASection } from "@/components/website/contact-cta-section"
import { AccordionSidebarSection } from "@/components/website/accordion-sidebar-section"
import type { Section } from "@/lib/page-builder"

interface RenderSectionProps {
  section: Section
  allSectionIds: Record<string, string>
}

export function RenderSection({ section, allSectionIds }: RenderSectionProps) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} />
    case "text-image":
      return <TextImageSection section={section} />
    case "testimonials":
      return <TestimonialsSection section={section} />
    case "product-grid":
      return <ProductGridSection section={section} id={allSectionIds[section.id]} />
    case "contact-cta":
      return <ContactCTASection section={section} />
    case "accordion-sidebar":
      return <AccordionSidebarSection section={section} allSectionIds={allSectionIds} />
    default:
      return <div>Unknown section type: {section.type}</div>
  }
}
