import { createServerClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function GET() {
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
    .order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createServerClient()
  const body = await request.json()

  const { data, error } = await supabase.from("products").insert([body]).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}
