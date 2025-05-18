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

    // Transform the data to use camelCase for the frontend
    const transformedData = {
      ...data,
      // Use the snake_case values from the database
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at || new Date().toISOString(),
    }

    // Remove the snake_case fields to avoid duplicates
    delete transformedData.created_at
    delete transformedData.updated_at

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error in GET page API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const supabase = createServerClient()
    const { id } = await Promise.resolve(context.params)
    const body = await request.json()

    // Create a copy of the body to avoid mutating the original
    const updateData = { ...body }

    // Handle column name conversion
    if ('createdAt' in updateData) {
      updateData.created_at = updateData.createdAt
      delete updateData.createdAt
    }
    
    if ('updatedAt' in updateData) {
      updateData.updated_at = updateData.updatedAt
      delete updateData.updatedAt
    }

    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("pages")
      .update(updateData)
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

    // Clean up any potential duplicate fields
    delete transformedData.created_at
    delete transformedData.updated_at

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

    // First, get the page to return some data before deletion
    const { data: pageData, error: fetchError } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !pageData) {
      console.error("Error finding page to delete:", fetchError)
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      )
    }

    // Now delete the page
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

    // Return the deleted page data with consistent field names
    const deletedPage = {
      ...pageData,
      createdAt: pageData.created_at,
      updatedAt: pageData.updated_at
    }
    
    // Clean up snake_case fields
    delete deletedPage.created_at
    delete deletedPage.updated_at

    return NextResponse.json({ 
      success: true,
      data: deletedPage 
    })
  } catch (error) {
    console.error("Error in DELETE page API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
