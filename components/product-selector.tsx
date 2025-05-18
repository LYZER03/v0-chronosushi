"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Product } from "@/lib/types"

interface ProductSelectorProps {
  selectedProductIds: string[]
  onProductsChange: (productIds: string[]) => void
}

export function ProductSelector({ selectedProductIds, onProductsChange }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data.filter((product: Product) => product.available))
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Update selected products when selectedProductIds changes
  useEffect(() => {
    const selected = products.filter((product) => selectedProductIds.includes(product.id))
    setSelectedProducts(selected)
  }, [products, selectedProductIds])

  const handleSelect = (productId: string) => {
    const isSelected = selectedProductIds.includes(productId)

    let newSelectedIds: string[]
    if (isSelected) {
      newSelectedIds = selectedProductIds.filter((id) => id !== productId)
    } else {
      newSelectedIds = [...selectedProductIds, productId]
    }

    onProductsChange(newSelectedIds)
  }

  const handleRemove = (productId: string) => {
    const newSelectedIds = selectedProductIds.filter((id) => id !== productId)
    onProductsChange(newSelectedIds)
  }

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading products...</span>
              </div>
            ) : (
              <>
                Select products...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search products..." />
            <CommandList>
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-72">
                  {products.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.id}
                      onSelect={() => {
                        handleSelect(product.id)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedProductIds.includes(product.id) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-xs text-muted-foreground">${Number(product.price).toFixed(2)}</span>
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <Badge key={product.id} variant="secondary" className="flex items-center gap-1">
              {product.name}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleRemove(product.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
