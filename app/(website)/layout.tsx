import type React from "react"
import { WebsiteHeader } from "@/components/website-header"
import { WebsiteFooter } from "@/components/website-footer"

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <WebsiteHeader />
      <main className="flex-1">{children}</main>
      <WebsiteFooter />
    </div>
  )
}
