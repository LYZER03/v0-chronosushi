import { createServerClient } from "@/lib/server"
import type { Page } from "@/lib/page-builder"

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !data) {
    console.error("Error fetching page:", error)
    return null
  }

  // Convert snake_case to camelCase for the frontend
  return {
    ...data,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Page
}

export async function getAllPublishedPages(): Promise<Page[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("status", "published")
    .order("title", { ascending: true })

  if (error || !data) {
    console.error("Error fetching pages:", error)
    return []
  }

  // Convert snake_case to camelCase for the frontend
  return data.map(page => ({
    ...page,
    createdAt: page.created_at,
    updatedAt: page.updated_at
  })) as Page[]
}

export async function savePage(page: Page) {
  const supabase = createServerClient()

  // Create a copy of the page to avoid mutating the original
  const pageToSave = { ...page }
  
  // Ensure we're using the correct column names for the database
  if ('createdAt' in pageToSave) {
    pageToSave.created_at = pageToSave.createdAt
    delete pageToSave.createdAt
  }
  
  if ('updatedAt' in pageToSave) {
    pageToSave.updated_at = pageToSave.updatedAt
    delete pageToSave.updatedAt
  }

  const { data, error } = await supabase
    .from("pages")
    .update(pageToSave)
    .eq("id", page.id)
    .select()

  if (error) {
    console.error("Error saving page:", error)
    throw error
  }

  // Transform the response back to camelCase for the frontend
  if (data && data[0]) {
    return {
      ...data[0],
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at
    }
  }

  return data
}

export async function publishPage(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("pages")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error publishing page:", error)
    throw error
  }

  return data
}
