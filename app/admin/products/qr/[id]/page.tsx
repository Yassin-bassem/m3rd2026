"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { Download, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductQRPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const qrRef = useRef<HTMLDivElement>(null)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

        if (error) throw error

        if (data) {
          setProduct(data)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, toast])

  const handleDownloadQR = () => {
    if (!qrRef.current || !product) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    // Create a canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions (make it larger for better quality)
    const scale = 3
    canvas.width = svg.width.baseVal.value * scale
    canvas.height = svg.height.baseVal.value * scale

    // Create an image from the SVG
    const img = new Image()
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      // Draw white background
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Create download link
      const link = document.createElement("a")
      link.download = `babyland-product-${product.code}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      // Clean up
      URL.revokeObjectURL(url)
    }

    img.src = url
  }

  if (loading) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/admin/products")}>
              Back to Products
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
          <CardTitle>Product QR Code</CardTitle>
          <CardDescription>
            {product.name} (Code: {product.code})
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div ref={qrRef} className="bg-white p-6 rounded-lg shadow-sm border">
            <QRCodeSVG
              value={product.code}
              size={300}
              level="H"
              includeMargin={true}
              bgColor={"#FFFFFF"}
              fgColor={"#000000"}
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Scan this QR code to view the product details
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1" onClick={() => router.push("/admin/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
            onClick={handleDownloadQR}
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
