"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Product, Category } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch("/api/products")
        if (!productsResponse.ok) throw new Error("Failed to fetch products")
        const productsData = await productsResponse.json()
        setProducts(productsData)

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories")
        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories")
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.image_url && (
            <Image
              src={row.original.image_url || "/placeholder.svg"}
              alt={row.original.name}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          )}
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("description") || "-"}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"))
        return <div className="font-medium">${price.toFixed(2)}</div>
      },
    },
    {
      accessorKey: "category_id",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.getValue("category_id") as string
        const category = categories.find((c) => c.id === categoryId)
        return <Badge variant="outline">{category?.name || "Uncategorized"}</Badge>
      },
    },
    {
      accessorKey: "available",
      header: "Available",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Switch
            checked={row.getValue("available")}
            onCheckedChange={async (checked) => {
              try {
                const response = await fetch(`/api/products/${row.original.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ available: checked }),
                })

                if (!response.ok) throw new Error("Failed to update product")

                const updatedProduct = await response.json()
                setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
              } catch (error) {
                console.error("Error updating product:", error)
                toast({
                  title: "Error",
                  description: "Failed to update product availability",
                  variant: "destructive",
                })
              }
            }}
          />
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setEditingProduct(product)
                  setIsDialogOpen(true)
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onRowSelectionChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater(table.getState().rowSelection)
        const selectedIds = Object.keys(newState).filter((id) => newState[id])
        setSelectedRows(selectedIds)
      }
    },
  })

  const handleAddProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) throw new Error("Failed to add product")

      const newProduct = await response.json()
      setProducts([...products, newProduct])
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Product added successfully",
      })
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = async (product: Partial<Product>) => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) throw new Error("Failed to update product")

      const updatedProduct = await response.json()
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
      setIsDialogOpen(false)
      setEditingProduct(null)

      toast({
        title: "Success",
        description: "Product updated successfully",
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete product")

      setProducts(products.filter((p) => p.id !== id))

      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSelected = async () => {
    try {
      // Delete each selected product
      await Promise.all(
        selectedRows.map((id) =>
          fetch(`/api/products/${id}`, {
            method: "DELETE",
          }),
        ),
      )

      setProducts(products.filter((product) => !selectedRows.includes(product.id)))
      setSelectedRows([])
      table.resetRowSelection()

      toast({
        title: "Success",
        description: `${selectedRows.length} product(s) deleted successfully`,
      })
    } catch (error) {
      console.error("Error deleting products:", error)
      toast({
        title: "Error",
        description: "Failed to delete selected products",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading products...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">Manage your restaurant menu items</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleDeleteSelected} className="text-red-600">
                Delete Selected
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto" onClick={() => setEditingProduct(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                  <DialogDescription>
                    {editingProduct
                      ? "Update the product details below."
                      : "Fill in the details to add a new product to your menu."}
                  </DialogDescription>
                </DialogHeader>
                <ProductForm
                  initialData={editingProduct || undefined}
                  categories={categories}
                  onSubmit={(data) => {
                    if (editingProduct) {
                      handleUpdateProduct(data)
                    } else {
                      handleAddProduct(data)
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProductFormProps {
  initialData?: Product
  categories: Category[]
  onSubmit: (data: Omit<Product, "id" | "created_at" | "updated_at">) => void
}

function ProductForm({ initialData, categories, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, "id" | "created_at" | "updated_at">>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category_id: initialData?.category_id || "",
    available: initialData?.available ?? true,
    image_url: initialData?.image_url || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image_url" className="text-right">
            Image URL
          </Label>
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="available" className="text-right">
            Available
          </Label>
          <div className="col-span-3 flex items-center">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  )
}
