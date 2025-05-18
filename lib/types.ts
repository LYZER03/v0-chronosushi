export type OrderStatus = "pending" | "preparing" | "delivered" | "canceled"

export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string
  image_url: string | null
  available: boolean
  created_at: string
  updated_at: string
  // Join with categories
  categories?: Category
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  status: OrderStatus
  total: number
  created_at: string
  updated_at: string
  // Virtual fields
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  price: number
  created_at: string
}

export interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  created_at: string
}

export interface SalesData {
  date: string
  amount: number
}
