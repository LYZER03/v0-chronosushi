"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { Plus, ArrowLeft, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { PagePreview } from "@/components/page-preview"
import { AddSectionDialog } from "@/components/add-section-dialog"
import { SortableSection } from "@/components/sortable-section"
import type { Page, Section, SectionType } from "@/lib/page-builder"

interface PageEditorProps {
  pageId: string
}

export function PageEditor({ pageId }: PageEditorProps) {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    const fetchPage = async () => {
      try {
        // Check if we're creating a new page
        if (pageId === "new") {
          const now = new Date().toISOString()
          setPage({
            id: pageId,
            title: "Untitled Page",
            slug: `page-${Date.now()}`,
            status: "draft",
            sections: [],
            // Include both formats to be safe
            created_at: now,
            updated_at: now,
            createdAt: now,
            updatedAt: now,
          })
          setLoading(false)
          return
        }

        const response = await fetch(`/api/pages/${pageId}`)
        if (!response.ok) throw new Error("Failed to fetch page")
        const data = await response.json()
        setPage(data)
      } catch (error) {
        console.error("Error fetching page:", error)
        toast({
          title: "Error",
          description: "Failed to load page",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [pageId, toast])

  const handleSavePage = async () => {
    if (!page) return

    setSaving(true)
    try {
      // Prepare the data to send, ensuring we use the correct field names
      const pageData = {
        ...page,
        // Ensure we're using snake_case for the API
        created_at: page.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Remove any undefined or null values that might cause issues
        sections: page.sections || []
      }

      // Remove any client-only fields that shouldn't be sent to the server
      // Using type assertion to make TypeScript happy
      const pageDataForApi = pageData as Omit<typeof pageData, 'createdAt' | 'updatedAt'>;
      delete (pageData as any).createdAt;
      delete (pageData as any).updatedAt;

      const response = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageDataForApi),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to save page")
      }

      const updatedPage = await response.json()
      
      // Update the local state with the response data
      setPage({
        ...updatedPage,
        // Ensure we maintain the expected camelCase in the frontend
        createdAt: updatedPage.created_at || updatedPage.createdAt,
        updatedAt: updatedPage.updated_at || updatedPage.updatedAt,
      })

      toast({
        title: "Success",
        description: "Page saved successfully",
      })
    } catch (error) {
      console.error("Error saving page:", error)
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePublishPage = async () => {
    if (!page) return

    setPublishing(true)
    try {
      // First save the page
      await handleSavePage()

      // Then publish it
      const response = await fetch(`/api/pages/${pageId}/publish`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to publish page")

      const result = await response.json()
      setPage(result.page)

      toast({
        title: "Success",
        description: "Page published successfully",
      })
    } catch (error) {
      console.error("Error publishing page:", error)
      toast({
        title: "Error",
        description: "Failed to publish page",
        variant: "destructive",
      })
    } finally {
      setPublishing(false)
    }
  }

  const handleAddSection = (sectionType: SectionType) => {
    if (!page) return

    let newSection: Section

    switch (sectionType) {
      case "hero":
        newSection = {
          id: `section-${Date.now()}`,
          type: "hero",
          heading: "Welcome to Our Restaurant",
          subheading: "Delicious food made with fresh ingredients",
          imageUrl: "/placeholder.svg?height=400&width=800",
        }
        break
      case "text-image":
        newSection = {
          id: `section-${Date.now()}`,
          type: "text-image",
          title: "Our Story",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
          imageUrl: "/placeholder.svg?height=400&width=600",
          imagePosition: "right",
        }
        break
      case "testimonials":
        newSection = {
          id: `section-${Date.now()}`,
          type: "testimonials",
          title: "What Our Customers Say",
          testimonials: [
            {
              id: `testimonial-${Date.now()}-1`,
              name: "John Doe",
              role: "Regular Customer",
              content: "The food here is amazing! I come here every week.",
              rating: 5,
            },
            {
              id: `testimonial-${Date.now()}-2`,
              name: "Jane Smith",
              role: "Food Critic",
              content: "Exceptional flavors and great atmosphere.",
              rating: 4,
            },
          ],
        }
        break
      case "product-grid":
        newSection = {
          id: `section-${Date.now()}`,
          type: "product-grid",
          title: "Our Menu",
          subtitle: "Explore our delicious offerings",
          productIds: [],
          showPrices: true,
        }
        break
      case "contact-cta":
        newSection = {
          id: `section-${Date.now()}`,
          type: "contact-cta",
          heading: "Make a Reservation",
          subheading: "Book your table online or call us",
          buttonText: "Book Now",
          buttonLink: "/reservation",
        }
        break
      case "accordion-sidebar":
        newSection = {
          id: `section-${Date.now()}`,
          type: "accordion-sidebar",
          title: "Menu Categories",
          categories: [
            {
              id: `category-${Date.now()}-1`,
              name: "Pizza",
              subcategories: [
                {
                  id: `subcategory-${Date.now()}-1`,
                  name: "Classic Pizzas",
                  targetSectionId: "",
                },
                {
                  id: `subcategory-${Date.now()}-2`,
                  name: "Specialty Pizzas",
                  targetSectionId: "",
                },
              ],
            },
            {
              id: `category-${Date.now()}-2`,
              name: "Pasta",
              subcategories: [
                {
                  id: `subcategory-${Date.now()}-3`,
                  name: "Spaghetti",
                  targetSectionId: "",
                },
                {
                  id: `subcategory-${Date.now()}-4`,
                  name: "Fettuccine",
                  targetSectionId: "",
                },
              ],
            },
          ],
          stickyOnDesktop: true,
          mobileDisplayMode: "collapsible",
        }
        break
      default:
        return
    }

    setPage({
      ...page,
      sections: [...page.sections, newSection],
    })

    setIsAddSectionDialogOpen(false)
  }

  const handleUpdateSection = (sectionId: string, updatedSection: Section) => {
    if (!page) return

    setPage({
      ...page,
      sections: page.sections.map((section) => (section.id === sectionId ? updatedSection : section)),
    })
  }

  const handleDeleteSection = (sectionId: string) => {
    if (!page) return

    setPage({
      ...page,
      sections: page.sections.filter((section) => section.id !== sectionId),
    })
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setPage((page) => {
        if (!page) return null

        const oldIndex = page.sections.findIndex((section) => section.id === active.id)
        const newIndex = page.sections.findIndex((section) => section.id === over.id)

        return {
          ...page,
          sections: arrayMove(page.sections, oldIndex, newIndex),
        }
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading page...</div>
  }

  if (!page) {
    return <div className="flex justify-center p-8">Page not found</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/pages")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
          {page.status === "published" && (
            <div className="ml-2 flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
              <Globe className="h-3 w-3" />
              <span>Published</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSavePage} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handlePublishPage} disabled={publishing}>
            {publishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input id="title" value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">/</span>
                    <Input id="slug" value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={page.description || ""}
                    onChange={(e) => setPage({ ...page, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Page Sections</h3>
                      <Button size="sm" onClick={() => setIsAddSectionDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Section
                      </Button>
                    </div>

                    {page.sections.length === 0 ? (
                      <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                        <h3 className="text-lg font-medium">No sections yet</h3>
                        <p className="text-sm text-muted-foreground">Add sections to build your page</p>
                        <Button variant="outline" className="mt-4" onClick={() => setIsAddSectionDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Section
                        </Button>
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                      >
                        <SortableContext
                          items={page.sections.map((section) => section.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-4">
                            {page.sections.map((section) => (
                              <SortableSection
                                key={section.id}
                                section={section}
                                onUpdate={(updatedSection) => handleUpdateSection(section.id, updatedSection)}
                                onDelete={() => handleDeleteSection(section.id)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="h-[600px] overflow-auto border-t">
                    <PagePreview page={page} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddSectionDialog
        open={isAddSectionDialogOpen}
        onOpenChange={setIsAddSectionDialogOpen}
        onAddSection={handleAddSection}
      />
    </div>
  )
}
