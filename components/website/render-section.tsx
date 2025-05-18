"use client"

import { Section } from "@/lib/page-builder"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Star } from "lucide-react"

type SectionRendererProps = {
  section: Section
  className?: string
  products?: any[]
  loading?: boolean
  allSectionIds?: Record<string, string>
}

export function RenderSection({ section, className, products = [], loading = false }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return (
        <div className={cn("relative overflow-hidden bg-gray-50 py-20", className)}>
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {section.heading}
              </h1>
              {section.subheading && (
                <p className="mb-8 text-xl text-gray-600">{section.subheading}</p>
              )}
            </div>
          </div>
        </div>
      )

    case "text-image":
      return (
        <div className={cn("overflow-hidden py-16", className)}>
          <div
            className={cn(
              "container mx-auto flex flex-col items-center px-4",
              section.imagePosition === "left" ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            <div className="md:w-1/2">
              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-200 md:h-96">
                {section.imageUrl && (
                  <Image
                    src={section.imageUrl}
                    alt={section.title || ""}
                    fill
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/2 md:px-12">
              <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
              <div className="prose mt-4 max-w-none text-gray-600">
                <p>{section.text}</p>
              </div>
            </div>
          </div>
        </div>
      )

    case "product-grid":
      return (
        <div 
          id={section.id} 
          className={cn("bg-white py-16 scroll-mt-16", className)}
          data-section-id={section.id}
        >
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
              {section.subtitle && (
                <p className="mt-2 text-lg text-gray-600">{section.subtitle}</p>
              )}
            </div>

            {loading ? (
              <div className="mt-12 text-center">Loading products...</div>
            ) : (
              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product: any) => (
                  <div key={product.id} className="group relative">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <Image
                        src={product.image || "/placeholder-product.png"}
                        alt={product.name}
                        fill
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <a href={`/products/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                          </a>
                        </h3>
                      </div>
                      {section.showPrices && product.price && (
                        <p className="text-sm font-medium text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )

    case "testimonials":
      return (
        <div className={cn("bg-gray-50 py-16", className)}>
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold text-gray-900">{section.title}</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {section.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="rounded-lg bg-white p-6 shadow">
                  <div className="mb-4 flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const rating = testimonial.rating ?? 0
                      return (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill={i < rating ? 'currentColor' : 'none'}
                        />
                      )
                    })}
                  </div>
                  <p className="mb-4 text-gray-600">"{testimonial.content}"</p>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case "contact-cta":
      return (
        <div className={cn("bg-indigo-700 py-16", className)}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">{section.heading}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
              {section.subheading}
            </p>
            <div className="mt-8">
              <a
                href={section.buttonLink}
                className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
              >
                {section.buttonText}
              </a>
            </div>
          </div>
        </div>
      )

    case "accordion-sidebar":
      return (
        <div className={cn("w-full py-4", className)}>
          <h3 className="mb-4 text-lg font-medium">{section.title}</h3>
          <div className="space-y-2">
            {section.categories.map((category) => (
              <div key={category.id} className="border-b border-gray-200 pb-2">
                <h4 className="font-medium">{category.name}</h4>
                <div className="mt-2 space-y-1 pl-4">
                  {category.subcategories.map((subcategory) => (
                    <a
                      key={subcategory.id}
                      href={`#${subcategory.targetSectionId}`}
                      className="block text-sm text-gray-600 hover:text-gray-900"
                    >
                      {subcategory.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return (
        <div className={cn("py-16", className)}>
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Unsupported section type: {(section as Section).type}
            </h2>
          </div>
        </div>
      )
  }
}
