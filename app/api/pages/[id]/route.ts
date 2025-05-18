import { createServerClient } from "@/lib/server"
import { NextResponse } from "next/server"

type RouteContext = {
  params: {
    id: string
  }
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const supabase = createServerClient()
    const { id } = await Promise.resolve(context.params)

    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching page:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      )
    }

    // Transform the data to ensure it has the expected structure
    const transformedData = {
      ...data,
      createdAt: data.created_at || data.createdAt,
      updatedAt: data.updated_at || data.updatedAt || data.created_at || new Date().toISOString(),
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error in GET page API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const supabase = createServerClient()
    const { id } = await Promise.resolve(context.params)
    const body = await request.json()

    // Update the updated_at timestamp
    body.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("pages")
      .update(body)
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating page:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      )
    }

    // Transform the response to include camelCase properties for frontend
    const transformedData = {
      ...data[0],
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at,
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error in PUT page API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const supabase = createServerClient()
    const { id } = await Promise.resolve(context.params)

    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting page:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE page API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
