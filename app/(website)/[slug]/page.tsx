import { getPageBySlug, getAllPublishedPages } from "@/lib/pages"
import { WebsitePage } from "@/components/website-page"
import { notFound } from "next/navigation"

// This function runs at build time to generate static paths
export async function generateStaticParams() {
  // For static generation, we'll return an empty array to avoid build-time data fetching
  // This means we'll rely on server-side rendering for dynamic content
  return []
  
  // If you want to pre-render specific pages, you can uncomment and modify this:
  /*
  const pages = await getAllPublishedPages()
  return pages.map((page) => ({
    slug: page.slug,
  }))
  */
}

type PageProps = {
  params: { slug: string }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await Promise.resolve(params)
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return <WebsitePage page={page} />
}

// This tells Next.js to revalidate this page every 60 seconds
export const revalidate = 60
