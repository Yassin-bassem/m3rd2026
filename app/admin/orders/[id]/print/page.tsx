"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Order, OrderItem, Customer } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

interface OrderDetails extends Order {
  customer: Customer
  items: OrderItem[]
}

export default function PrintInvoicePage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [])

  async function fetchOrderDetails() {
    try {
      setLoading(true)

      // Fetch order and customer
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          customer:customers(*)
        `)
        .eq("id", id)
        .single()

      if (orderError) throw orderError

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", id)

      if (itemsError) throw itemsError

      setOrder({
        ...orderData,
        items: itemsData || [],
      })
    } catch (error) {
      console.error("Error fetching order details:", error)
      toast({
        title: "Error",
        description: "Failed to load order details",
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
    })
  }

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading invoice...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Order not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/orders")}>
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container py-8 print:hidden">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => router.push(`/admin/orders/${order.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Order
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div ref={printRef} className="container max-w-3xl mx-auto bg-white p-8 print:p-0">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center">
            <Logo className="print:text-black" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold mb-1">INVOICE</h1>
            <p className="text-sm text-muted-foreground">Order #{order.id.substring(0, 8)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-semibold text-lg mb-2">Bill To:</h2>
            <p className="font-medium">{order.customer.name}</p>
            <p>{order.customer.phone}</p>
            {order.customer.email && <p>{order.customer.email}</p>}
            <p>{order.customer.location}</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="font-semibold">Invoice Date:</span>
              <span className="ml-2">{formatDate(order.created_at)}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>
              <span className="ml-2 capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.id} className={index !== order.items.length - 1 ? "border-b border-gray-200" : ""}>
                <td className="py-3">
                  <div className="font-medium">{item.product_name}</div>
                  <div className="text-xs text-muted-foreground">Code: {item.product_code}</div>
                </td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">{formatCurrency(item.unit_price)}</td>
                <td className="py-3 text-right">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-300">
              <td colSpan={3} className="py-3 text-right font-semibold">
                Total:
              </td>
              <td className="py-3 text-right font-bold">{formatCurrency(order.total_amount)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="border-t border-gray-300 pt-4">
          <h2 className="font-semibold text-lg mb-2">Notes:</h2>
          <p className="text-sm text-muted-foreground">
            Thank you for your business! If you have any questions about this invoice, please contact us.
          </p>
        </div>
      </div>
    </>
  )
}
