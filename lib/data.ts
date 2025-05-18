// Types
export type OrderStatus = "pending" | "preparing" | "delivered" | "canceled"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  image?: string
}

export interface Category {
  id: string
  name: string
  description: string
  productCount: number
}

export interface Order {
  id: string
  customerName: string
  date: string
  status: OrderStatus
  items: {
    productId: string
    name: string
    quantity: number
    price: number
  }[]
  total: number
}

export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
}

export interface SalesData {
  date: string
  amount: number
}

// Mock data
export const products: Product[] = [
  {
    id: "p1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
    available: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "p2",
    name: "Pepperoni Pizza",
    description: "Pizza with tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    category: "Pizza",
    available: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "p3",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 8.99,
    category: "Salad",
    available: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "p4",
    name: "Spaghetti Carbonara",
    description: "Spaghetti with egg, cheese, pancetta, and black pepper",
    price: 15.99,
    category: "Pasta",
    available: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "p5",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee, mascarpone, and cocoa",
    price: 7.99,
    category: "Dessert",
    available: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "p6",
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs",
    price: 4.99,
    category: "Appetizer",
    available: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "p7",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with chocolate ganache",
    price: 6.99,
    category: "Dessert",
    available: false,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export const categories: Category[] = [
  {
    id: "c1",
    name: "Pizza",
    description: "Traditional Italian pizzas",
    productCount: 2,
  },
  {
    id: "c2",
    name: "Pasta",
    description: "Authentic Italian pasta dishes",
    productCount: 1,
  },
  {
    id: "c3",
    name: "Salad",
    description: "Fresh and healthy salads",
    productCount: 1,
  },
  {
    id: "c4",
    name: "Dessert",
    description: "Sweet treats to finish your meal",
    productCount: 2,
  },
  {
    id: "c5",
    name: "Appetizer",
    description: "Starters to begin your meal",
    productCount: 1,
  },
]

export const orders: Order[] = [
  {
    id: "o1",
    customerName: "John Smith",
    date: "2023-05-15T14:30:00",
    status: "delivered",
    items: [
      {
        productId: "p1",
        name: "Margherita Pizza",
        quantity: 2,
        price: 12.99,
      },
      {
        productId: "p3",
        name: "Caesar Salad",
        quantity: 1,
        price: 8.99,
      },
    ],
    total: 34.97,
  },
  {
    id: "o2",
    customerName: "Emily Johnson",
    date: "2023-05-15T18:45:00",
    status: "pending",
    items: [
      {
        productId: "p2",
        name: "Pepperoni Pizza",
        quantity: 1,
        price: 14.99,
      },
      {
        productId: "p6",
        name: "Garlic Bread",
        quantity: 1,
        price: 4.99,
      },
    ],
    total: 19.98,
  },
  {
    id: "o3",
    customerName: "Michael Brown",
    date: "2023-05-15T19:15:00",
    status: "preparing",
    items: [
      {
        productId: "p4",
        name: "Spaghetti Carbonara",
        quantity: 2,
        price: 15.99,
      },
      {
        productId: "p5",
        name: "Tiramisu",
        quantity: 2,
        price: 7.99,
      },
    ],
    total: 47.96,
  },
  {
    id: "o4",
    customerName: "Sarah Wilson",
    date: "2023-05-15T20:00:00",
    status: "canceled",
    items: [
      {
        productId: "p1",
        name: "Margherita Pizza",
        quantity: 1,
        price: 12.99,
      },
    ],
    total: 12.99,
  },
  {
    id: "o5",
    customerName: "David Lee",
    date: "2023-05-16T12:30:00",
    status: "pending",
    items: [
      {
        productId: "p2",
        name: "Pepperoni Pizza",
        quantity: 2,
        price: 14.99,
      },
      {
        productId: "p7",
        name: "Chocolate Cake",
        quantity: 1,
        price: 6.99,
      },
    ],
    total: 36.97,
  },
]

export const reviews: Review[] = [
  {
    id: "r1",
    customerName: "John Smith",
    rating: 5,
    comment: "Excellent food and fast delivery!",
    date: "2023-05-15",
  },
  {
    id: "r2",
    customerName: "Emily Johnson",
    rating: 4,
    comment: "Great pizza, but delivery was a bit late.",
    date: "2023-05-15",
  },
  {
    id: "r3",
    customerName: "Michael Brown",
    rating: 5,
    comment: "Best pasta I've ever had!",
    date: "2023-05-15",
  },
  {
    id: "r4",
    customerName: "Sarah Wilson",
    rating: 3,
    comment: "Food was good but arrived cold.",
    date: "2023-05-16",
  },
]

export const salesData: SalesData[] = [
  { date: "Mon", amount: 120 },
  { date: "Tue", amount: 150 },
  { date: "Wed", amount: 180 },
  { date: "Thu", amount: 220 },
  { date: "Fri", amount: 300 },
  { date: "Sat", amount: 350 },
  { date: "Sun", amount: 280 },
]
