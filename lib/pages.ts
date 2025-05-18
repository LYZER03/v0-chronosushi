import { createClient } from "@/lib/client"
import type { Page } from "@/lib/page-builder"

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).eq("status", "published").single()

  if (error || !data) {
    console.error("Error fetching page:", error)
    return null
  }

  return data as Page
}

export async function getAllPublishedPages(): Promise<Page[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("status", "published")
    .order("title", { ascending: true })

  if (error || !data) {
    console.error("Error fetching pages:", error)
    return []
  }

  return data as Page[]
}
