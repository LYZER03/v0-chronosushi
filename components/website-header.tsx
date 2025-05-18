import Link from "next/link"
import { getAllPublishedPages } from "@/lib/pages"

export async function WebsiteHeader() {
  const pages = await getAllPublishedPages()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span>Restaurant Name</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {pages.map((page) => (
              <li key={page.id}>
                <Link href={`/${page.slug}`} className="text-sm font-medium transition-colors hover:text-primary">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:hidden">
          {/* Mobile menu button would go here */}
          <button className="p-2">
            <span className="sr-only">Open menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
