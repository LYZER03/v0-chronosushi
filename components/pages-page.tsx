"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileEdit, Trash2, Eye, ArrowUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Page } from "@/lib/page-builder"

export function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    description: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch("/api/pages")
        if (!response.ok) throw new Error("Failed to fetch pages")
        const data = await response.json()
        setPages(data)
      } catch (error) {
        console.error("Error fetching pages:", error)
        toast({
          title: "Error",
          description: "Failed to load pages",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [toast])

  const handleCreatePage = async () => {
    try {
      // Generate slug if not provided
      let slug = newPage.slug
      if (!slug && newPage.title) {
        slug = newPage.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      }

      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newPage.title,
          slug,
          description: newPage.description,
          status: "draft",
          sections: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to create page")

      const createdPage = await response.json()
      setPages([createdPage, ...pages])
      setIsCreateDialogOpen(false)
      setNewPage({ title: "", slug: "", description: "" })

      toast({
        title: "Success",
        description: "Page created successfully",
      })

      // Navigate to the page editor
      router.push(`/pages/${createdPage.id}`)
    } catch (error) {
      console.error("Error creating page:", error)
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive",
      })
    }
  }

  const handleDeletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete page")

      setPages(pages.filter((page) => page.id !== id))

      toast({
        title: "Success",
        description: "Page deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting page:", error)
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      })
    }
  }

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (page.description && page.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (loading) {
    return <div className="flex justify-center p-8">Loading pages...</div>
  }

  // Helper function to get a formatted date string
  const getFormattedDate = (page: Page) => {
    // Try to use updatedAt, fall back to updated_at, then created_at, then current date
    const dateString =
      page.updatedAt || page.updated_at || page.createdAt || page.created_at || new Date().toISOString()

    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Unknown date"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
        <p className="text-muted-foreground">Manage your website pages</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Page
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
                <DialogDescription>Fill in the details to create a new page for your website.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newPage.title}
                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <div className="col-span-3 flex items-center gap-1">
                    <span className="text-muted-foreground">/</span>
                    <Input
                      id="slug"
                      value={newPage.slug}
                      onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                      placeholder="Generated from title if empty"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newPage.description}
                    onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreatePage} disabled={!newPage.title}>
                  Create Page
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <div className="flex items-center">
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>/{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant={page.status === "published" ? "default" : "secondary"}>
                        {page.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getFormattedDate(page)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/pages/${page.id}`)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeletePage(page.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No pages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
