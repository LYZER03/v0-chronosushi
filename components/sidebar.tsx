"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, ShoppingBag, LayoutGrid, ClipboardList, Settings, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: BarChart3,
    },
    {
      name: "Products",
      path: "/products",
      icon: ShoppingBag,
    },
    {
      name: "Categories",
      path: "/categories",
      icon: LayoutGrid,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: ClipboardList,
    },
    {
      name: "Pages",
      path: "/pages",
      icon: FileText,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ]

  const SidebarContent = (
    <>
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-6 w-6" />
          <span>Restaurant Admin</span>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => onOpenChange(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onOpenChange(false)
                }
              }}
            >
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2", pathname === route.path && "bg-muted")}
              >
                <route.icon className="h-5 w-5" />
                {route.name}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  )

  return (
    <>
      <aside className="hidden w-64 flex-col border-r md:flex">{SidebarContent}</aside>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0">
          {SidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}
