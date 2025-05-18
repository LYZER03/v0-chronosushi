"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { ProductGridSection as ProductGridSectionType, Product } from "@/lib/page-builder"

interface ProductGridSectionProps {
  section: ProductGridSectionType
  id?: string
}

export function ProductGridSection({ section, id }: ProductGridSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (section.productIds.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        const response = await fetch(`/api/products?ids=${section.productIds.join(",")}`)
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [section.productIds])

  return (
    <div id={id} className="w-full">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold">{section.title}</h2>
        {section.subtitle && <p className="text-lg text-gray-600">{section.subtitle}</p>}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 h-48 w-full animate-pulse bg-gray-200" />
              <CardContent className="p-4">
                <div className="mb-2 h-6 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500">No products selected for this section</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={product.imageUrl || "/placeholder.svg?height=200&width=300"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1 font-medium">{product.name}</h3>
                {section.showPrices && <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
