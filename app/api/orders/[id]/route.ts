import { createServerClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Get the order
  const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", params.id).single()

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 })
  }

  // Get the order items
  const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", params.id)

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  return NextResponse.json({ ...order, items })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const body = await request.json()

  const { data, error } = await supabase.from("orders").update(body).eq("id", params.id).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Delete order items first (cascade should handle this, but just to be safe)
  const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", params.id)

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  // Then delete the order
  const { error } = await supabase.from("orders").delete().eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
