import { getPageBySlug, getAllPublishedPages } from "@/lib/pages"
import { WebsitePage } from "@/components/website-page"
import { redirect } from "next/navigation"

export default async function HomePage() {
  // Try to get the home page
  const homePage = await getPageBySlug("home")

  // If home page exists, render it
  if (homePage) {
    return <WebsitePage page={homePage} />
  }

  // Otherwise, get the first published page
  const pages = await getAllPublishedPages()

  // If there are any published pages, redirect to the first one
  if (pages.length > 0) {
    redirect(`/${pages[0].slug}`)
  }

  // If no pages exist, show a placeholder
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold">Welcome to Our Restaurant</h1>
      <p className="mt-4 text-lg text-muted-foreground">No pages have been published yet. Please check back later.</p>
    </div>
  )
}
