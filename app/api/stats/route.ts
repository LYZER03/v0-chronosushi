import { createServerClient } from "@/lib/server"
import { NextResponse } from "next/server"
import { salesData as fallbackSalesData } from "@/lib/data"

export async function GET() {
  try {
    console.log("Stats API route called")

    let supabase
    try {
      supabase = createServerClient()
    } catch (error) {
      console.error("Failed to create Supabase client:", error)
      return NextResponse.json({
        totalSales: 0,
        orderCounts: [
          { status: "pending", count: 0 },
          { status: "preparing", count: 0 },
          { status: "delivered", count: 0 },
          { status: "canceled", count: 0 },
        ],
        averageRating: 0,
        salesChartData: fallbackSalesData,
      })
    }

    // Get total sales
    const { data: salesData, error: salesError } = await supabase
      .from("orders")
      .select("total")
      .not("status", "eq", "canceled")

    if (salesError) {
      console.error("Error fetching sales data:", salesError)
      return NextResponse.json({ error: salesError.message }, { status: 500 })
    }

    const totalSales = salesData.reduce((sum, order) => sum + Number(order.total), 0)

    // Get order counts by status using individual queries for better reliability
    const { data: pendingOrders, error: pendingError } = await supabase
      .from("orders")
      .select("id")
      .eq("status", "pending")

    const { data: preparingOrders, error: preparingError } = await supabase
      .from("orders")
      .select("id")
      .eq("status", "preparing")

    const { data: deliveredOrders, error: deliveredError } = await supabase
      .from("orders")
      .select("id")
      .eq("status", "delivered")

    const { data: canceledOrders, error: canceledError } = await supabase
      .from("orders")
      .select("id")
      .eq("status", "canceled")

    if (pendingError || preparingError || deliveredError || canceledError) {
      console.error("Error fetching order counts:", { pendingError, preparingError, deliveredError, canceledError })
      // Continue with partial data instead of failing completely
    }

    const orderCounts = [
      { status: "pending", count: pendingOrders?.length || 0 },
      { status: "preparing", count: preparingOrders?.length || 0 },
      { status: "delivered", count: deliveredOrders?.length || 0 },
      { status: "canceled", count: canceledOrders?.length || 0 },
    ]

    // Get average rating
    const { data: reviewData, error: reviewError } = await supabase.from("reviews").select("rating")

    if (reviewError) {
      console.error("Error fetching review data:", reviewError)
      // Continue with default value instead of failing
    }

    const averageRating =
      reviewData && reviewData.length > 0
        ? reviewData.reduce((sum, review) => sum + review.rating, 0) / reviewData.length
        : 0

    // Get sales by day for the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: dailySales, error: dailyError } = await supabase
      .from("orders")
      .select("created_at, total")
      .not("status", "eq", "canceled")
      .gte("created_at", sevenDaysAgo.toISOString())

    if (dailyError) {
      console.error("Error fetching daily sales:", dailyError)
      // Continue with empty data instead of failing
    }

    // Process daily sales into a format for charts
    const salesByDay: Record<string, number> = {}

    // Initialize with the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", { weekday: "short" })
      salesByDay[dateStr] = 0
    }

    // Fill in actual sales data
    if (dailySales) {
      dailySales.forEach((order) => {
        const dateStr = new Date(order.created_at).toLocaleDateString("en-US", { weekday: "short" })
        salesByDay[dateStr] = (salesByDay[dateStr] || 0) + Number(order.total)
      })
    }

    // Convert to array format for charts
    const salesChartData = Object.entries(salesByDay)
      .map(([date, amount]) => ({
        date,
        amount,
      }))
      .reverse()

    console.log("Stats API response:", {
      totalSales,
      orderCounts,
      averageRating,
      salesChartData: salesChartData.length,
    })

    return NextResponse.json({
      totalSales,
      orderCounts,
      averageRating,
      salesChartData,
    })
  } catch (error) {
    console.error("Error in stats API:", error)
    // Return a basic response with zeros to prevent UI errors
    return NextResponse.json({
      totalSales: 0,
      orderCounts: [
        { status: "pending", count: 0 },
        { status: "preparing", count: 0 },
        { status: "delivered", count: 0 },
        { status: "canceled", count: 0 },
      ],
      averageRating: 0,
      salesChartData: fallbackSalesData,
    })
  }
}
