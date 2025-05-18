export type PageStatus = "draft" | "published"

export interface Page {
  id: string
  title: string
  slug: string
  description?: string
  status: PageStatus
  sections: Section[]
  createdAt?: string
  updatedAt?: string
  created_at?: string
  updated_at?: string
}

export type SectionType = "hero" | "text-image" | "testimonials" | "product-grid" | "contact-cta" | "accordion-sidebar"

export interface BaseSection {
  id: string
  type: SectionType
  title?: string
  subtitle?: string
  backgroundColor?: string
}

export interface HeroSection extends BaseSection {
  type: "hero"
  imageUrl?: string
  heading: string
  subheading?: string
  ctaText?: string
  ctaLink?: string
}

export interface TextImageSection extends BaseSection {
  type: "text-image"
  imageUrl?: string
  text: string
  imagePosition: "left" | "right"
  ctaText?: string
  ctaLink?: string
}

export interface TestimonialItem {
  id: string
  name: string
  role?: string
  content: string
  avatarUrl?: string
  rating?: number
}

export interface TestimonialsSection extends BaseSection {
  type: "testimonials"
  testimonials: TestimonialItem[]
}

export interface ProductGridSection extends BaseSection {
  type: "product-grid"
  productIds: string[]
  showPrices: boolean
  ctaText?: string
  ctaLink?: string
}

export interface ContactCTASection extends BaseSection {
  type: "contact-cta"
  heading: string
  subheading?: string
  buttonText: string
  buttonLink?: string
  backgroundImageUrl?: string
}

export interface CategoryItem {
  id: string
  name: string
  subcategories: SubcategoryItem[]
}

export interface SubcategoryItem {
  id: string
  name: string
  targetSectionId: string
}

export interface AccordionSidebarSection extends BaseSection {
  type: "accordion-sidebar"
  categories: CategoryItem[]
  stickyOnDesktop: boolean
  mobileDisplayMode: "dropdown" | "collapsible"
}

export type Section =
  | HeroSection
  | TextImageSection
  | TestimonialsSection
  | ProductGridSection
  | ContactCTASection
  | AccordionSidebarSection
