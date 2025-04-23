"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Html5Scanner } from "./html5-scanner"

export default function ScanPage() {
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Start scanning with a small delay
    const timer = setTimeout(() => {
      setScanning(true)
      setLoading(false)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const handleScanSuccess = (code: string) => {
    console.log("Scan success:", code)
    router.push(`/shop/product/${code}`)
  }

  const handleScanError = (errorMessage: string) => {
    setError(errorMessage)
    setScanning(false)
  }

  const handleCancel = () => {
    router.push("/shop")
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>Position the QR code within the scanner frame</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">{error}</div>}

          {loading && (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {scanning && !error && !loading && (
            <Html5Scanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} onCancel={handleCancel} />
          )}

          {!scanning && !loading && error && (
            <div className="text-center p-4">
              <p className="mb-4">Failed to start scanner. Please check camera permissions and try again.</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="w-full" onClick={handleCancel}>
            {scanning ? "Cancel" : "Back to Home"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
