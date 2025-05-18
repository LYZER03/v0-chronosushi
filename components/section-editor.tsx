"use client"
import { Plus, Trash, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"
import { ProductSelector } from "@/components/product-selector"
import type { Section } from "@/lib/page-builder"

interface SectionEditorProps {
  section: Section
  onUpdate: (section: Section) => void
  allSections?: Section[]
}

export function SectionEditor({ section, onUpdate, allSections = [] }: SectionEditorProps) {
  // Get only product-grid sections for the accordion sidebar target selection
  const productGridSections = allSections.filter((s) => s.type === "product-grid" && s.id !== section.id)

  const renderEditor = () => {
    switch (section.type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-heading">Heading</Label>
              <Input
                id="hero-heading"
                value={section.heading}
                onChange={(e) => onUpdate({ ...section, heading: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subheading">Subheading</Label>
              <Input
                id="hero-subheading"
                value={section.subheading}
                onChange={(e) => onUpdate({ ...section, subheading: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-image">Image URL</Label>
              <Input
                id="hero-image"
                value={section.imageUrl}
                onChange={(e) => onUpdate({ ...section, imageUrl: e.target.value })}
              />
            </div>
            {section.ctaText !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="hero-cta-text">CTA Text</Label>
                <Input
                  id="hero-cta-text"
                  value={section.ctaText}
                  onChange={(e) => onUpdate({ ...section, ctaText: e.target.value })}
                />
              </div>
            )}
            {section.ctaLink !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="hero-cta-link">CTA Link</Label>
                <Input
                  id="hero-cta-link"
                  value={section.ctaLink}
                  onChange={(e) => onUpdate({ ...section, ctaLink: e.target.value })}
                />
              </div>
            )}
          </div>
        )

      case "text-image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-image-title">Title</Label>
              <Input
                id="text-image-title"
                value={section.title}
                onChange={(e) => onUpdate({ ...section, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-image-text">Text</Label>
              <Textarea
                id="text-image-text"
                value={section.text}
                onChange={(e) => onUpdate({ ...section, text: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-image-url">Image URL</Label>
              <Input
                id="text-image-url"
                value={section.imageUrl}
                onChange={(e) => onUpdate({ ...section, imageUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-image-position">Image Position</Label>
              <Select
                value={section.imagePosition}
                onValueChange={(value) => onUpdate({ ...section, imagePosition: value as "left" | "right" })}
              >
                <SelectTrigger id="text-image-position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "testimonials":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testimonials-title">Title</Label>
              <Input
                id="testimonials-title"
                value={section.title}
                onChange={(e) => onUpdate({ ...section, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Testimonials</Label>
              <div className="space-y-4">
                {section.testimonials.map((testimonial, index) => (
                  <Collapsible key={testimonial.id}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="flex items-center gap-2">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onUpdate({
                              ...section,
                              testimonials: section.testimonials.filter((_, i) => i !== index),
                            })
                          }
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <CollapsibleContent className="space-y-2 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor={`testimonial-${index}-name`}>Name</Label>
                        <Input
                          id={`testimonial-${index}-name`}
                          value={testimonial.name}
                          onChange={(e) => {
                            const updatedTestimonials = [...section.testimonials]
                            updatedTestimonials[index] = { ...testimonial, name: e.target.value }
                            onUpdate({ ...section, testimonials: updatedTestimonials })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`testimonial-${index}-role`}>Role</Label>
                        <Input
                          id={`testimonial-${index}-role`}
                          value={testimonial.role}
                          onChange={(e) => {
                            const updatedTestimonials = [...section.testimonials]
                            updatedTestimonials[index] = { ...testimonial, role: e.target.value }
                            onUpdate({ ...section, testimonials: updatedTestimonials })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`testimonial-${index}-content`}>Content</Label>
                        <Textarea
                          id={`testimonial-${index}-content`}
                          value={testimonial.content}
                          onChange={(e) => {
                            const updatedTestimonials = [...section.testimonials]
                            updatedTestimonials[index] = { ...testimonial, content: e.target.value }
                            onUpdate({ ...section, testimonials: updatedTestimonials })
                          }}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`testimonial-${index}-rating`}>Rating</Label>
                        <Select
                          value={testimonial.rating.toString()}
                          onValueChange={(value) => {
                            const updatedTestimonials = [...section.testimonials]
                            updatedTestimonials[index] = { ...testimonial, rating: Number.parseInt(value) }
                            onUpdate({ ...section, testimonials: updatedTestimonials })
                          }}
                        >
                          <SelectTrigger id={`testimonial-${index}-rating`}>
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
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  onUpdate({
                    ...section,
                    testimonials: [
                      ...section.testimonials,
                      {
                        id: `testimonial-${Date.now()}`,
                        name: "New Testimonial",
                        role: "Customer",
                        content: "This is a great place!",
                        rating: 5,
                      },
                    ],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </div>
          </div>
        )

      case "product-grid":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-grid-title">Title</Label>
              <Input
                id="product-grid-title"
                value={section.title}
                onChange={(e) => onUpdate({ ...section, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-grid-subtitle">Subtitle</Label>
              <Input
                id="product-grid-subtitle"
                value={section.subtitle}
                onChange={(e) => onUpdate({ ...section, subtitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="product-grid-show-prices">Show Prices</Label>
                <Switch
                  id="product-grid-show-prices"
                  checked={section.showPrices}
                  onCheckedChange={(checked) => onUpdate({ ...section, showPrices: checked })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Products</Label>
              <ProductSelector
                selectedProductIds={section.productIds}
                onProductsChange={(productIds) => onUpdate({ ...section, productIds })}
              />
            </div>
          </div>
        )

      case "contact-cta":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-cta-heading">Heading</Label>
              <Input
                id="contact-cta-heading"
                value={section.heading}
                onChange={(e) => onUpdate({ ...section, heading: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-cta-subheading">Subheading</Label>
              <Input
                id="contact-cta-subheading"
                value={section.subheading}
                onChange={(e) => onUpdate({ ...section, subheading: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-cta-button-text">Button Text</Label>
              <Input
                id="contact-cta-button-text"
                value={section.buttonText}
                onChange={(e) => onUpdate({ ...section, buttonText: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-cta-button-link">Button Link</Label>
              <Input
                id="contact-cta-button-link"
                value={section.buttonLink}
                onChange={(e) => onUpdate({ ...section, buttonLink: e.target.value })}
              />
            </div>
          </div>
        )

      case "accordion-sidebar":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accordion-sidebar-title">Title</Label>
              <Input
                id="accordion-sidebar-title"
                value={section.title}
                onChange={(e) => onUpdate({ ...section, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="accordion-sidebar-sticky">Sticky on Desktop</Label>
                <Switch
                  id="accordion-sidebar-sticky"
                  checked={section.stickyOnDesktop}
                  onCheckedChange={(checked) => onUpdate({ ...section, stickyOnDesktop: checked })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accordion-sidebar-mobile-mode">Mobile Display Mode</Label>
              <Select
                value={section.mobileDisplayMode}
                onValueChange={(value) =>
                  onUpdate({ ...section, mobileDisplayMode: value as "dropdown" | "collapsible" })
                }
              >
                <SelectTrigger id="accordion-sidebar-mobile-mode">
                  <SelectValue placeholder="Select mobile display mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                  <SelectItem value="collapsible">Collapsible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="space-y-4">
                {section.categories.map((category, categoryIndex) => (
                  <Collapsible key={category.id}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{category.name}</div>
                      <div className="flex items-center gap-2">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onUpdate({
                              ...section,
                              categories: section.categories.filter((_, i) => i !== categoryIndex),
                            })
                          }
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <CollapsibleContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor={`category-${categoryIndex}-name`}>Category Name</Label>
                        <Input
                          id={`category-${categoryIndex}-name`}
                          value={category.name}
                          onChange={(e) => {
                            const updatedCategories = [...section.categories]
                            updatedCategories[categoryIndex] = {
                              ...category,
                              name: e.target.value,
                            }
                            onUpdate({ ...section, categories: updatedCategories })
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Subcategories</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updatedCategories = [...section.categories]
                              updatedCategories[categoryIndex] = {
                                ...category,
                                subcategories: [
                                  ...category.subcategories,
                                  {
                                    id: `subcategory-${Date.now()}`,
                                    name: "New Subcategory",
                                    targetSectionId: "default",
                                  },
                                ],
                              }
                              onUpdate({ ...section, categories: updatedCategories })
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Subcategory
                          </Button>
                        </div>

                        <Card>
                          <CardContent className="p-4">
                            {category.subcategories.map((subcategory, subcategoryIndex) => (
                              <div
                                key={subcategory.id}
                                className="mb-4 border-b pb-4 last:mb-0 last:border-b-0 last:pb-0"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{subcategory.name}</div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updatedCategories = [...section.categories]
                                      updatedCategories[categoryIndex] = {
                                        ...category,
                                        subcategories: category.subcategories.filter((_, i) => i !== subcategoryIndex),
                                      }
                                      onUpdate({ ...section, categories: updatedCategories })
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>

                                <div className="mt-2 space-y-2">
                                  <Label htmlFor={`subcategory-${categoryIndex}-${subcategoryIndex}-name`}>
                                    Subcategory Name
                                  </Label>
                                  <Input
                                    id={`subcategory-${categoryIndex}-${subcategoryIndex}-name`}
                                    value={subcategory.name}
                                    onChange={(e) => {
                                      const updatedCategories = [...section.categories]
                                      const updatedSubcategories = [...category.subcategories]
                                      updatedSubcategories[subcategoryIndex] = {
                                        ...subcategory,
                                        name: e.target.value,
                                      }
                                      updatedCategories[categoryIndex] = {
                                        ...category,
                                        subcategories: updatedSubcategories,
                                      }
                                      onUpdate({ ...section, categories: updatedCategories })
                                    }}
                                  />
                                </div>

                                <div className="mt-2 space-y-2">
                                  <Label htmlFor={`subcategory-${categoryIndex}-${subcategoryIndex}-target`}>
                                    Target Product Grid Section
                                  </Label>
                                  <Select
                                    value={subcategory.targetSectionId}
                                    onValueChange={(value) => {
                                      const updatedCategories = [...section.categories]
                                      const updatedSubcategories = [...category.subcategories]
                                      updatedSubcategories[subcategoryIndex] = {
                                        ...subcategory,
                                        targetSectionId: value,
                                      }
                                      updatedCategories[categoryIndex] = {
                                        ...category,
                                        subcategories: updatedSubcategories,
                                      }
                                      onUpdate({ ...section, categories: updatedCategories })
                                    }}
                                  >
                                    <SelectTrigger id={`subcategory-${categoryIndex}-${subcategoryIndex}-target`}>
                                      <SelectValue placeholder="Select target section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="default">None</SelectItem>
                                      {productGridSections.map((gridSection) => (
                                        <SelectItem key={gridSection.id} value={gridSection.id}>
                                          {gridSection.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))}

                            {category.subcategories.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-4 text-center">
                                <p className="text-sm text-muted-foreground">No subcategories added yet</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => {
                                    const updatedCategories = [...section.categories]
                                    updatedCategories[categoryIndex] = {
                                      ...category,
                                      subcategories: [
                                        ...category.subcategories,
                                        {
                                          id: `subcategory-${Date.now()}`,
                                          name: "New Subcategory",
                                          targetSectionId: "default",
                                        },
                                      ],
                                    }
                                    onUpdate({ ...section, categories: updatedCategories })
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Subcategory
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  onUpdate({
                    ...section,
                    categories: [
                      ...section.categories,
                      {
                        id: `category-${Date.now()}`,
                        name: "New Category",
                        subcategories: [],
                      },
                    ],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>
        )

      default:
        return <div>Unknown section type: {section.type}</div>
    }
  }

  return renderEditor()
}
