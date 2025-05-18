"use client"

import { useState, useEffect } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Order, OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("all")
  const { toast } = useToast()

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        if (!response.ok) throw new Error("Failed to fetch orders")
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id").substring(0, 8)}...</div>,
    },
    {
      accessorKey: "customer_name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("customer_name")}</div>,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <div>{date.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as OrderStatus
        return <OrderStatusBadge status={status} />
      },
      filterFn: (row, id, value) => {
        return value === "all" ? true : row.getValue(id) === value
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("total"))
        return <div className="text-right font-medium">${amount.toFixed(2)}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original

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
                  setSelectedOrder(order)
                  setIsDialogOpen(true)
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                disabled={order.status === "delivered" || order.status === "canceled"}
              >
                Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateOrderStatus(order.id, "canceled")}
                disabled={order.status === "delivered" || order.status === "canceled"}
                className="text-red-600"
              >
                Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  const table = useReactTable({
    data: filteredOrders,
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
  })

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update order status")

      const updatedOrder = await response.json()

      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status })
      }

      toast({
        title: "Success",
        description: `Order status updated to ${status}`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            defaultValue="all"
            className="w-full"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
            }}
          >
            <TabsList className="grid w-full grid-cols-5 sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="preparing">Preparing</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="canceled">Canceled</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex w-full items-center gap-2 sm:max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={(table.getColumn("customer_name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("customer_name")?.setFilterValue(event.target.value)}
              className="h-9"
            />
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
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} order(s) total.
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

      {selectedOrder && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order #{selectedOrder.id.substring(0, 8)}... - {new Date(selectedOrder.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <h3 className="font-medium">Customer</h3>
                <p>{selectedOrder.customer_name}</p>
                {selectedOrder.customer_email && (
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                )}
                {selectedOrder.customer_phone && (
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                )}
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Status</h3>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={selectedOrder.status} />
                  {selectedOrder.status !== "delivered" && selectedOrder.status !== "canceled" && (
                    <Select
                      defaultValue={selectedOrder.status}
                      onValueChange={(value) => handleUpdateOrderStatus(selectedOrder.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <h3 className="font-medium">Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            ${Number.parseFloat(item.price.toString()).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${(item.quantity * Number.parseFloat(item.price.toString())).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-right">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">${Number.parseFloat(selectedOrder.total.toString()).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { label: "Pending", variant: "warning" },
    preparing: { label: "Preparing", variant: "info" },
    delivered: { label: "Delivered", variant: "success" },
    canceled: { label: "Canceled", variant: "destructive" },
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  const variantClasses = {
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
    success: "bg-green-100 text-green-800 hover:bg-green-100/80",
    destructive: "bg-red-100 text-red-800 hover:bg-red-100/80",
  }

  return <Badge className={cn(variantClasses[config.variant as keyof typeof variantClasses])}>{config.label}</Badge>
}
