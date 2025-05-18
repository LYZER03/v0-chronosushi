import { createServerClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { id } = params

    // Update the page status to published and update the updated_at timestamp
    const { data, error } = await supabase
      .from("pages")
      .update({ status: "published", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error publishing page:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    // Transform the response to include camelCase properties for frontend
    const transformedData = {
      ...data[0],
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at,
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error in publish page API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
