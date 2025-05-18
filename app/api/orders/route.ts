import { createServerClient } from "@/lib/server"
import { NextResponse } from "next/server"
import { orders as fallbackOrders } from "@/lib/data"

export async function GET() {
  try {
    console.log("Orders API route called")

    let supabase
    try {
      supabase = createServerClient()
    } catch (error) {
      console.error("Failed to create Supabase client:", error)
      return NextResponse.json(fallbackOrders)
    }

    // Get all orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (ordersError) {
      console.error("Error fetching orders:", ordersError)
      return NextResponse.json(fallbackOrders)
    }

    // Get all order items
    const { data: orderItems, error: itemsError } = await supabase.from("order_items").select("*")

    if (itemsError) {
      console.error("Error fetching order items:", itemsError)
      // Return orders without items
      return NextResponse.json(orders)
    }

    // Combine orders with their items
    const ordersWithItems = orders.map((order) => {
      const items = orderItems.filter((item) => item.order_id === order.id)
      return { ...order, items }
    })

    console.log("Orders API response:", ordersWithItems.length)
    return NextResponse.json(ordersWithItems)
  } catch (error) {
    console.error("Error in orders API:", error)
    return NextResponse.json(fallbackOrders)
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const { order, items } = await request.json()

    // Start a transaction by using a single batch
    // First insert the order
    const { data: orderData, error: orderError } = await supabase.from("orders").insert([order]).select()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const orderId = orderData[0].id

    // Then insert all order items
    const itemsWithOrderId = items.map((item: any) => ({
      ...item,
      order_id: orderId,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(itemsWithOrderId)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ ...orderData[0], items: itemsWithOrderId })
  } catch (error) {
    console.error("Error in POST orders API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
