"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Trash2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductSelector } from "@/components/product-selector"
import type {
  Section,
  HeroSection,
  TextImageSection,
  TestimonialsSection,
  ProductGridSection,
  ContactCTASection,
  TestimonialItem,
  AccordionSidebarSection,
  AccordionSidebarCategory,
  AccordionSidebarSubcategory,
} from "@/lib/page-builder"

interface SectionEditorProps {
  section: Section
  onUpdate: (section: Section) => void
  expanded?: boolean
  onToggleExpand?: () => void
  onDelete?: () => void
}

export function SectionEditor({ section, onUpdate, expanded = true, onToggleExpand, onDelete }: SectionEditorProps) {
  const handleUpdate = <T extends Section>(updates: Partial<T>) => {
    onUpdate({ ...section, ...updates } as Section)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-base">{getSectionTitle(section)}</CardTitle>
        <div className="flex items-center gap-1">
          {onDelete && (
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {onToggleExpand && (
            <Button variant="ghost" size="icon" onClick={onToggleExpand}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="p-4 pt-0">
          {section.type === "hero" && <HeroSectionEditor section={section} onUpdate={handleUpdate} />}
          {section.type === "text-image" && <TextImageSectionEditor section={section} onUpdate={handleUpdate} />}
          {section.type === "testimonials" && <TestimonialsSectionEditor section={section} onUpdate={handleUpdate} />}
          {section.type === "product-grid" && <ProductGridSectionEditor section={section} onUpdate={handleUpdate} />}
          {section.type === "contact-cta" && <ContactCTASectionEditor section={section} onUpdate={handleUpdate} />}
          {section.type === "accordion-sidebar" && (
            <AccordionSidebarSectionEditor section={section} onUpdate={handleUpdate} />
          )}
        </CardContent>
      )}
    </Card>
  )
}

function getSectionTitle(section: Section): string {
  switch (section.type) {
    case "hero":
      return "Hero Section"
    case "text-image":
      return "Text with Image"
    case "testimonials":
      return "Testimonials"
    case "product-grid":
      return "Product Grid"
    case "contact-cta":
      return "Contact CTA"
    case "accordion-sidebar":
      return "Accordion Sidebar"
    default:
      return "Section"
  }
}

function HeroSectionEditor({
  section,
  onUpdate,
}: {
  section: HeroSection
  onUpdate: (updates: Partial<HeroSection>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hero-heading">Heading</Label>
        <Input id="hero-heading" value={section.heading} onChange={(e) => onUpdate({ heading: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hero-subheading">Subheading</Label>
        <Input
          id="hero-subheading"
          value={section.subheading}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hero-image">Image URL</Label>
        <Input id="hero-image" value={section.imageUrl} onChange={(e) => onUpdate({ imageUrl: e.target.value })} />
      </div>
    </div>
  )
}

function TextImageSectionEditor({
  section,
  onUpdate,
}: {
  section: TextImageSection
  onUpdate: (updates: Partial<TextImageSection>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text-image-title">Title</Label>
        <Input id="text-image-title" value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="text-image-text">Text</Label>
        <Textarea
          id="text-image-text"
          value={section.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="text-image-url">Image URL</Label>
        <Input id="text-image-url" value={section.imageUrl} onChange={(e) => onUpdate({ imageUrl: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Image Position</Label>
        <RadioGroup
          value={section.imagePosition}
          onValueChange={(value) => onUpdate({ imagePosition: value as "left" | "right" })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="image-left" />
            <Label htmlFor="image-left">Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="image-right" />
            <Label htmlFor="image-right">Right</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

function TestimonialsSectionEditor({
  section,
  onUpdate,
}: {
  section: TestimonialsSection
  onUpdate: (updates: Partial<TestimonialsSection>) => void
}) {
  const [expandedTestimonial, setExpandedTestimonial] = useState<string | null>(null)

  const handleAddTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: `testimonial-${Date.now()}`,
      name: "New Customer",
      role: "Customer",
      content: "This is a great place!",
      rating: 5,
    }

    onUpdate({
      testimonials: [...section.testimonials, newTestimonial],
    })

    setExpandedTestimonial(newTestimonial.id)
  }

  const handleUpdateTestimonial = (id: string, updates: Partial<TestimonialItem>) => {
    onUpdate({
      testimonials: section.testimonials.map((testimonial) =>
        testimonial.id === id ? { ...testimonial, ...updates } : testimonial,
      ),
    })
  }

  const handleDeleteTestimonial = (id: string) => {
    onUpdate({
      testimonials: section.testimonials.filter((testimonial) => testimonial.id !== id),
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="testimonials-title">Title</Label>
        <Input id="testimonials-title" value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Testimonials</Label>
          <Button size="sm" variant="outline" onClick={handleAddTestimonial}>
            <Plus className="mr-1 h-3 w-3" /> Add Testimonial
          </Button>
        </div>

        <div className="space-y-3">
          {section.testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-3">
                <CardTitle className="text-sm">{testimonial.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      setExpandedTestimonial(expandedTestimonial === testimonial.id ? null : testimonial.id)
                    }
                  >
                    {expandedTestimonial === testimonial.id ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {expandedTestimonial === testimonial.id && (
                <CardContent className="p-3 pt-0">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`testimonial-name-${testimonial.id}`} className="text-xs">
                        Name
                      </Label>
                      <Input
                        id={`testimonial-name-${testimonial.id}`}
                        value={testimonial.name}
                        onChange={(e) => handleUpdateTestimonial(testimonial.id, { name: e.target.value })}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`testimonial-role-${testimonial.id}`} className="text-xs">
                        Role
                      </Label>
                      <Input
                        id={`testimonial-role-${testimonial.id}`}
                        value={testimonial.role}
                        onChange={(e) => handleUpdateTestimonial(testimonial.id, { role: e.target.value })}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`testimonial-content-${testimonial.id}`} className="text-xs">
                        Content
                      </Label>
                      <Textarea
                        id={`testimonial-content-${testimonial.id}`}
                        value={testimonial.content}
                        onChange={(e) => handleUpdateTestimonial(testimonial.id, { content: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`testimonial-rating-${testimonial.id}`} className="text-xs">
                        Rating (1-5)
                      </Label>
                      <Select
                        value={testimonial.rating.toString()}
                        onValueChange={(value) =>
                          handleUpdateTestimonial(testimonial.id, { rating: Number.parseInt(value, 10) })
                        }
                      >
                        <SelectTrigger id={`testimonial-rating-${testimonial.id}`} className="h-8">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductGridSectionEditor({
  section,
  onUpdate,
}: {
  section: ProductGridSection
  onUpdate: (updates: Partial<ProductGridSection>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product-grid-title">Title</Label>
        <Input id="product-grid-title" value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="product-grid-subtitle">Subtitle</Label>
        <Input
          id="product-grid-subtitle"
          value={section.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Products</Label>
        <ProductSelector
          selectedProductIds={section.productIds}
          onProductsChange={(productIds) => onUpdate({ productIds })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-prices"
          checked={section.showPrices}
          onCheckedChange={(checked) => onUpdate({ showPrices: checked })}
        />
        <Label htmlFor="show-prices">Show prices</Label>
      </div>
    </div>
  )
}

function ContactCTASectionEditor({
  section,
  onUpdate,
}: {
  section: ContactCTASection
  onUpdate: (updates: Partial<ContactCTASection>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact-cta-heading">Heading</Label>
        <Input
          id="contact-cta-heading"
          value={section.heading}
          onChange={(e) => onUpdate({ heading: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-cta-subheading">Subheading</Label>
        <Input
          id="contact-cta-subheading"
          value={section.subheading}
          onChange={(e) => onUpdate({ subheading: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-cta-button-text">Button Text</Label>
        <Input
          id="contact-cta-button-text"
          value={section.buttonText}
          onChange={(e) => onUpdate({ buttonText: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-cta-button-link">Button Link</Label>
        <Input
          id="contact-cta-button-link"
          value={section.buttonLink}
          onChange={(e) => onUpdate({ buttonLink: e.target.value })}
        />
      </div>
    </div>
  )
}

function AccordionSidebarSectionEditor({
  section,
  onUpdate,
}: {
  section: AccordionSidebarSection
  onUpdate: (updates: Partial<AccordionSidebarSection>) => void
}) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const handleAddCategory = () => {
    const newCategory: AccordionSidebarCategory = {
      id: `category-${Date.now()}`,
      name: "New Category",
      subcategories: [],
    }

    onUpdate({
      categories: [...section.categories, newCategory],
    })

    setExpandedCategory(newCategory.id)
  }

  const handleUpdateCategory = (id: string, updates: Partial<AccordionSidebarCategory>) => {
    onUpdate({
      categories: section.categories.map((category) => (category.id === id ? { ...category, ...updates } : category)),
    })
  }

  const handleDeleteCategory = (id: string) => {
    onUpdate({
      categories: section.categories.filter((category) => category.id !== id),
    })
  }

  const handleAddSubcategory = (categoryId: string) => {
    const newSubcategory: AccordionSidebarSubcategory = {
      id: `subcategory-${Date.now()}`,
      name: "New Subcategory",
      targetSectionId: "",
    }

    onUpdate({
      categories: section.categories.map((category) =>
        category.id === categoryId
          ? { ...category, subcategories: [...category.subcategories, newSubcategory] }
          : category,
      ),
    })
  }

  const handleUpdateSubcategory = (
    categoryId: string,
    subcategoryId: string,
    updates: Partial<AccordionSidebarSubcategory>,
  ) => {
    onUpdate({
      categories: section.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: category.subcategories.map((subcategory) =>
                subcategory.id === subcategoryId ? { ...subcategory, ...updates } : subcategory,
              ),
            }
          : category,
      ),
    })
  }

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    onUpdate({
      categories: section.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: category.subcategories.filter((subcategory) => subcategory.id !== subcategoryId),
            }
          : category,
      ),
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accordion-sidebar-title">Title</Label>
        <Input
          id="accordion-sidebar-title"
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="sticky-on-desktop"
          checked={section.stickyOnDesktop}
          onCheckedChange={(checked) => onUpdate({ stickyOnDesktop: checked })}
        />
        <Label htmlFor="sticky-on-desktop">Sticky on desktop</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile-display-mode">Mobile Display Mode</Label>
        <Select
          value={section.mobileDisplayMode}
          onValueChange={(value) => onUpdate({ mobileDisplayMode: value as "dropdown" | "collapsible" })}
        >
          <SelectTrigger id="mobile-display-mode">
            <SelectValue placeholder="Select display mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dropdown">Dropdown</SelectItem>
            <SelectItem value="collapsible">Collapsible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Categories</Label>
          <Button size="sm" variant="outline" onClick={handleAddCategory}>
            <Plus className="mr-1 h-3 w-3" /> Add Category
          </Button>
        </div>

        <div className="space-y-3">
          {section.categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-3">
                <CardTitle className="text-sm">{category.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  >
                    {expandedCategory === category.id ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {expandedCategory === category.id && (
                <CardContent className="p-3 pt-0">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`category-name-${category.id}`} className="text-xs">
                        Category Name
                      </Label>
                      <Input
                        id={`category-name-${category.id}`}
                        value={category.name}
                        onChange={(e) => handleUpdateCategory(category.id, { name: e.target.value })}
                        className="h-8"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Subcategories</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleAddSubcategory(category.id)}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center gap-2">
                            <Input
                              value={subcategory.name}
                              onChange={(e) =>
                                handleUpdateSubcategory(category.id, subcategory.id, { name: e.target.value })
                              }
                              className="h-7 flex-1"
                              placeholder="Subcategory name"
                            />
                            <Input
                              value={subcategory.targetSectionId}
                              onChange={(e) =>
                                handleUpdateSubcategory(category.id, subcategory.id, {
                                  targetSectionId: e.target.value,
                                })
                              }
                              className="h-7 w-24"
                              placeholder="Target ID"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
