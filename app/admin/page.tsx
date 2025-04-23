"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, ShoppingCart, BarChart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)

        // Get product count
        const { count: productCount, error: productError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        if (productError) throw productError

        // Get order count and total revenue
        const { data: orders, error: ordersError } = await supabase.from("orders").select("total_amount")

        if (ordersError) throw ordersError

        const totalRevenue = orders.reduce((sum, order) => sum + Number.parseFloat(order.total_amount), 0)

        setStats({
          totalProducts: productCount || 0,
          totalOrders: orders.length,
          totalRevenue,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and orders</p>
        </div>
        <div className="flex gap-4">
          <Button asChild className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500">
            <Link href="/admin/products/new">Add New Product</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Products in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Orders received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total sales revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/products">View All Products</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/products/new">Add New Product</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/orders/pending">View Pending Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
