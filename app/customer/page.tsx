import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CustomerHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Baby Land</h1>
        <p className="text-lg text-muted-foreground">Scan a product QR code to view details and add it to your cart.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
          >
            <Link href="/customer/scan">Scan QR Code</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
