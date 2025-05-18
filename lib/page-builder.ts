export type SectionType = "hero" | "text-image" | "testimonials" | "product-grid" | "contact-cta" | "accordion-sidebar"

export interface Page {
  id: string
  title: string
  slug: string
  description?: string
  status: "draft" | "published"
  sections: Section[]
  createdAt: string
  updatedAt: string
  created_at?: string // For database compatibility
  updated_at?: string // For database compatibility
}

export type Section =
  | HeroSection
  | TextImageSection
  | TestimonialsSection
  | ProductGridSection
  | ContactCTASection
  | AccordionSidebarSection

export interface HeroSection {
  id: string
  type: "hero"
  heading: string
  subheading: string
  imageUrl: string
}

export interface TextImageSection {
  id: string
  type: "text-image"
  title: string
  text: string
  imageUrl: string
  imagePosition: "left" | "right"
}

export interface TestimonialItem {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

export interface TestimonialsSection {
  id: string
  type: "testimonials"
  title: string
  testimonials: TestimonialItem[]
}

export interface ProductGridSection {
  id: string
  type: "product-grid"
  title: string
  subtitle: string
  productIds: string[]
  showPrices: boolean
}

export interface ContactCTASection {
  id: string
  type: "contact-cta"
  heading: string
  subheading: string
  buttonText: string
  buttonLink: string
}

export interface AccordionSidebarCategory {
  id: string
  name: string
  subcategories: AccordionSidebarSubcategory[]
}

export interface AccordionSidebarSubcategory {
  id: string
  name: string
  targetSectionId: string
}

export interface AccordionSidebarSection {
  id: string
  type: "accordion-sidebar"
  title: string
  categories: AccordionSidebarCategory[]
  stickyOnDesktop: boolean
  mobileDisplayMode: "dropdown" | "collapsible"
}
