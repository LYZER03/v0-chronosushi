import { createServerClient } from "@/lib/server"
import { NextResponse } from "next/server"
import { reviews as fallbackReviews } from "@/lib/data"

export async function GET() {
  try {
    console.log("Reviews API route called")

    let supabase
    try {
      supabase = createServerClient()
    } catch (error) {
      console.error("Failed to create Supabase client:", error)
      return NextResponse.json(fallbackReviews)
    }

    const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json(fallbackReviews)
    }

    console.log("Reviews API response:", data.length)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in reviews API:", error)
    return NextResponse.json(fallbackReviews)
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data, error } = await supabase.from("reviews").insert([body]).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in POST reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
