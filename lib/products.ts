import { createServerClient } from "./server"

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  available: boolean
  category_id?: string
  created_at: string
  updated_at: string
}

export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
  if (!productIds || productIds.length === 0) return []

  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories:category_id (
        id,
        name
      )
    `)
    .in("id", productIds)
    .order("name")

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}
