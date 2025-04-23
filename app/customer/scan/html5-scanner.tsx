"use client"

import { useState, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"

interface Html5ScannerProps {
  onScanSuccess: (code: string) => void
  onScanError: (error: string) => void
  onCancel: () => void
}

export function Html5Scanner({ onScanSuccess, onScanError, onCancel }: Html5ScannerProps) {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null)

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null

    const initScanner = async () => {
      try {
        // Create scanner instance
        html5QrCode = new Html5Qrcode("reader")
        setScanner(html5QrCode)

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        }

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            // QR code detected
            console.log("QR Code detected:", decodedText)
            onScanSuccess(decodedText)
          },
          (errorMessage) => {
            // Just log errors, don't show to user unless critical
            console.log("QR scan error:", errorMessage)
          },
        )
      } catch (error) {
        console.error("Scanner initialization error:", error)
        onScanError("Failed to initialize scanner. Please ensure camera permissions are granted.")
      }
    }

    initScanner()

    // Cleanup
    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch((error) => {
          console.error("Error stopping scanner:", error)
        })
      }
    }
  }, [onScanSuccess, onScanError])

  const handleCancel = () => {
    if (scanner) {
      scanner.stop().catch((error) => {
        console.error("Error stopping scanner:", error)
      })
    }
    onCancel()
  }

  return (
    <div className="space-y-4">
      <div id="reader" className="w-full h-64 overflow-hidden rounded-lg"></div>
      <p className="text-center text-sm text-muted-foreground">
        Scanning... Please position the QR code in the center of the frame.
      </p>
      <Button variant="outline" className="w-full" onClick={handleCancel}>
        Cancel
      </Button>
    </div>
  )
}
