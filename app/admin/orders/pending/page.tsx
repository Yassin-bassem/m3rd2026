"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, FileText, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface OrderWithCustomer {
  id: string
  customer_id: string
  total_amount: number
  deposit_amount: number
  status: string
  created_at: string
  customer: {
    name: string
    phone: string
  }
}

export default function PendingOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<OrderWithCustomer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingOrders()
  }, [])

  async function fetchPendingOrders() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          customer:customers(name, phone)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching pending orders:", error)
      toast({
        title: "Error",
        description: "Failed to load pending orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Orders</h1>
          <p className="text-muted-foreground">View and manage orders awaiting processing</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Orders
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Order List</CardTitle>
          <CardDescription>Orders that need your attention</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending orders found</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/admin/orders">View All Orders</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      {order.customer?.name}
                      <div className="text-xs text-muted-foreground">{order.customer?.phone}</div>
                    </TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/orders/${order.id}/print`}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Print</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
