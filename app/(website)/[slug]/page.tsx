import { getPageBySlug, getAllPublishedPages } from "@/lib/pages"
import { WebsitePage } from "@/components/website-page"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const pages = await getAllPublishedPages()

  return pages.map((page) => ({
    slug: page.slug,
  }))
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
