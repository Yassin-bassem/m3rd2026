"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/components/cart-provider"

export default function ProductPage({ params }: { params: { code: string } }) {
  const { code } = params
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("products").select("*").eq("code", code).single()

        if (error) {
          throw error
        }

        if (data) {
          setProduct(data)
        } else {
          setError("Product not found")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [code])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        product,
        quantity,
      })

      toast({
        title: "Added to invoice",
        description: `${quantity} x ${product.name} added to your invoice`,
      })
    }
  }

  if (loading) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-end gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "Product not found"}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/shop")}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>Product Code: {product.code}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{product.description}</p>
          <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>

          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <p className="text-lg font-semibold">Total: {formatCurrency(product.price * quantity)}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
            onClick={handleAddToCart}
          >
            Add to Invoice
          </Button>
          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1" onClick={() => router.push("/shop/scan")}>
              Scan Another
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => router.push("/shop/cart")}>
              View Invoice
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
