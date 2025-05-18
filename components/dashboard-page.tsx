"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ArrowDown, ArrowUp, DollarSign, ShoppingBag, Users, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Order, Review, SalesData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// Import fallback data
import { orders as fallbackOrders, reviews as fallbackReviews, salesData as fallbackSalesData } from "@/lib/data"

export function DashboardPage() {
  const [timeframe, setTimeframe] = useState("week")
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [stats, setStats] = useState({
    totalSales: 0,
    averageRating: 0,
    orderCounts: [] as { status: string; count: number }[],
  })
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching dashboard data...")

        // Fetch orders
        let ordersData: Order[] = []
        try {
          const ordersResponse = await fetch("/api/orders")
          console.log("Orders response status:", ordersResponse.status)

          if (ordersResponse.ok) {
            ordersData = await ordersResponse.json()
            console.log("Fetched orders:", ordersData.length)
            setOrders(ordersData)
          } else {
            console.error("Failed to fetch orders:", await ordersResponse.text())
            // Use fallback data
            setOrders(fallbackOrders as unknown as Order[])
            ordersData = fallbackOrders as unknown as Order[]
          }
        } catch (ordersError) {
          console.error("Error fetching orders:", ordersError)
          // Use fallback data
          setOrders(fallbackOrders as unknown as Order[])
          ordersData = fallbackOrders as unknown as Order[]
        }

        // Fetch reviews
        let reviewsData: Review[] = []
        try {
          const reviewsResponse = await fetch("/api/reviews")
          console.log("Reviews response status:", reviewsResponse.status)

          if (reviewsResponse.ok) {
            reviewsData = await reviewsResponse.json()
            console.log("Fetched reviews:", reviewsData.length)
            setReviews(reviewsData)
          } else {
            console.error("Failed to fetch reviews:", await reviewsResponse.text())
            // Use fallback data
            setReviews(fallbackReviews as unknown as Review[])
            reviewsData = fallbackReviews as unknown as Review[]
          }
        } catch (reviewsError) {
          console.error("Error fetching reviews:", reviewsError)
          // Use fallback data
          setReviews(fallbackReviews as unknown as Review[])
          reviewsData = fallbackReviews as unknown as Review[]
        }

        // Try to fetch stats
        try {
          const statsResponse = await fetch("/api/stats")
          console.log("Stats response status:", statsResponse.status)

          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            console.log("Fetched stats:", statsData)

            setStats({
              totalSales: statsData.totalSales,
              averageRating: statsData.averageRating,
              orderCounts: statsData.orderCounts,
            })
            setSalesData(statsData.salesChartData)
          } else {
            console.error("Failed to fetch stats:", await statsResponse.text())
            // Calculate basic stats from orders and reviews
            calculateFallbackStats(ordersData, reviewsData)
          }
        } catch (statsError) {
          console.error("Error fetching stats:", statsError)
          // Calculate basic stats from orders and reviews
          calculateFallbackStats(ordersData, reviewsData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Using fallback data.")

        // Use fallback data
        setOrders(fallbackOrders as unknown as Order[])
        setReviews(fallbackReviews as unknown as Review[])
        setSalesData(fallbackSalesData)

        toast({
          title: "Error",
          description: "Failed to load dashboard data. Using fallback data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    // Function to calculate basic stats from orders and reviews if the API fails
    const calculateFallbackStats = (ordersData: Order[], reviewsData: Review[]) => {
      console.log("Calculating fallback stats")

      // Calculate total sales
      const totalSales = ordersData.reduce((sum, order) => {
        if (order.status !== "canceled") {
          return (
            sum +
            Number(typeof order.total === "number" ? order.total : Number.parseFloat(order.total as unknown as string))
          )
        }
        return sum
      }, 0)

      // Calculate average rating
      const averageRating =
        reviewsData.length > 0 ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length : 0

      // Count orders by status
      const statusCounts: Record<string, number> = {}
      ordersData.forEach((order) => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
      })

      const orderCounts = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      }))

      setStats({
        totalSales,
        averageRating,
        orderCounts,
      })

      // Use fallback sales data if needed
      setSalesData(fallbackSalesData)
    }

    fetchData()
  }, [toast])

  // Calculate summary data
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const preparingOrders = orders.filter((order) => order.status === "preparing").length
  const totalOrders = orders.length

  // Data for pie chart
  const statusData = [
    { name: "Pending", value: pendingOrders, color: "#f59e0b" },
    { name: "Preparing", value: preparingOrders, color: "#3b82f6" },
    { name: "Delivered", value: orders.filter((order) => order.status === "delivered").length, color: "#10b981" },
    { name: "Canceled", value: orders.filter((order) => order.status === "canceled").length, color: "#ef4444" },
  ]

  if (loading) {
    return <div className="flex justify-center p-8">Loading dashboard data...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Warning</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your restaurant performance</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">12%</span>
              <span className="ml-1">from last {timeframe}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">8%</span>
              <span className="ml-1">from last {timeframe}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders + preparingOrders}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              <span className="text-red-500">2%</span>
              <span className="ml-1">from last {timeframe}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">5%</span>
              <span className="ml-1">from last {timeframe}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Sales performance for the current week</CardDescription>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeframe("week")}
                  className={timeframe === "week" ? "bg-muted" : ""}
                >
                  Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeframe("month")}
                  className={timeframe === "month" ? "bg-muted" : ""}
                >
                  Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeframe("year")}
                  className={timeframe === "year" ? "bg-muted" : ""}
                >
                  Year
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{order.customerName || order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date || order.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            $
                            {typeof order.total === "number"
                              ? order.total.toFixed(2)
                              : Number.parseFloat(order.total as unknown as string).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {(review.customerName || review.customer_name)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.customerName || review.customer_name}</p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.date || review.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
