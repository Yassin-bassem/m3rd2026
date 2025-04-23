"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product.code || !product.name || !product.price) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Convert price to number
      const numericPrice = Number.parseFloat(product.price)

      if (isNaN(numericPrice)) {
        throw new Error("Invalid price")
      }

      const { data, error } = await supabase
        .from("products")
        .insert({
          code: product.code,
          name: product.name,
          description: product.description,
          price: numericPrice,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Product created",
        description: "The product has been created successfully",
      })

      router.push(`/admin/products/qr/${data.id}`)
    } catch (error: any) {
      console.error("Error creating product:", error)

      let errorMessage = "Failed to create product"

      // Handle duplicate code error
      if (error.code === "23505" && error.message.includes("code")) {
        errorMessage = "A product with this code already exists"
      }

      toast({
        title: "Error",
        description: errorMessage,
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
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Create a new product for your inventory</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Product Code *</Label>
              <Input id="code" name="code" required value={product.code} onChange={handleInputChange} />
              <p className="text-xs text-muted-foreground">A unique identifier for the product</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" name="name" required value={product.name} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={product.price}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/admin/products")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
