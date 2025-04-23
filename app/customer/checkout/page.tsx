"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "../cart/cart-provider"
import { supabase } from "@/lib/supabase"
import type { Customer, Order, OrderItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, totalAmount, clearCart } = useCart()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    location: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomer((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add items to your invoice before checkout",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Insert customer
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .insert(customer)
        .select("id")
        .single()

      if (customerError) throw customerError

      // 2. Create order - IMPORTANT: Don't include items array in the order object
      const orderData: Omit<Order, "items"> = {
        customer_id: customerData.id,
        total_amount: totalAmount,
        status: "pending",
      }

      const { data: orderResult, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select("id")
        .single()

      if (orderError) throw orderError

      // 3. Create order items
      const orderItems: OrderItem[] = items.map((item) => ({
        order_id: orderResult.id,
        product_id: item.product.id,
        product_code: item.product.code,
        product_name: item.product.name,
        unit_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Success! Clear cart and redirect
      clearCart()

      toast({
        title: "Order submitted successfully!",
        description: "Your order has been received and is being processed.",
      })

      router.push("/customer/confirmation")
    } catch (error) {
      console.error("Error submitting order:", error)
      toast({
        title: "Failed to submit order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Please provide your information to complete your order</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required value={customer.name} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" required value={customer.phone} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store">store name</Label>
              <Input id="store" name="store" type="store" required value={customer.store} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Delivery Address</Label>
              <Textarea id="location" name="location" required value={customer.location} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit</Label>
              <Textarea id="deposit" name="deposit" required value={customer.deposit} onChange={handleInputChange} />
            </div>


            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/customer/cart")}
              disabled={isSubmitting}
            >
              Back to Invoice
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Order"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
