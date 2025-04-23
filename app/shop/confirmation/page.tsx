"use client"

import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmationPage() {
  const router = useRouter()

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center">Order Confirmed!</CardTitle>
          <CardDescription className="text-center">
            Thank you for your order. Your invoice has been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            The store owner will process your order shortly. You can close this page now.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
            onClick={() => router.push("/shop")}
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
