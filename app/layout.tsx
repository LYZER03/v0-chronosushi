import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Restaurant Admin Dashboard",
  description: "Admin dashboard for restaurant management",
}

// This is a workaround to prevent the hydration mismatch
// We'll suppress the warning since we know what we're doing
const suppressHydrationWarning = true

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning={suppressHydrationWarning}
    >
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
          // Force a consistent theme on initial render
          enableColorScheme={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
