import { createServerClient } from "@/lib/server"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Changed from updatedAt to created_at since updatedAt doesn't exist
    const { data, error } = await supabase.from("pages").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching pages:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to ensure it has the expected structure
    const transformedData = data.map((page) => ({
      ...page,
      // If updatedAt doesn't exist, use created_at as a fallback
      updatedAt: page.updated_at || page.created_at || new Date().toISOString(),
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error in pages API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    // Generate a new ID if not provided
    if (!body.id) {
      body.id = uuidv4()
    }

    // Set timestamps - using snake_case for database columns
    const now = new Date().toISOString()
    body.created_at = now
    body.updated_at = now

    // Ensure sections is an array
    if (!body.sections) {
      body.sections = []
    }

    const { data, error } = await supabase.from("pages").insert([body]).select()

    if (error) {
      console.error("Error creating page:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the response to include camelCase properties for frontend
    const transformedData = {
      ...data[0],
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at,
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error in POST pages API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
