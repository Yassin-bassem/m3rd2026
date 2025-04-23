"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import jsQR from "jsqr"
import { Button } from "@/components/ui/button"

interface FallbackScannerProps {
  onScanSuccess: (code: string) => void
  onScanError: (error: string) => void
  onCancel: () => void
}

export function FallbackScanner({ onScanSuccess, onScanError, onCancel }: FallbackScannerProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    let animationFrameId: number
    let videoStream: MediaStream | null = null

    const startScanner = async () => {
      try {
        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        // Check if component is still mounted
        if (!mountedRef.current) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        videoStream = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream

          try {
            // Add a small delay before playing to ensure the video element is ready
            await new Promise((resolve) => setTimeout(resolve, 100))

            // Check if component is still mounted
            if (!mountedRef.current) {
              stream.getTracks().forEach((track) => track.stop())
              return
            }

            await videoRef.current.play()
            setScanning(true)

            // Start scanning loop
            const scanFrame = () => {
              if (!mountedRef.current || !videoRef.current || !canvasRef.current) return

              const video = videoRef.current
              const canvas = canvasRef.current
              const ctx = canvas.getContext("2d")

              if (!ctx) return

              // Make sure video is ready
              if (video.readyState !== video.HAVE_ENOUGH_DATA) {
                animationFrameId = requestAnimationFrame(scanFrame)
                return
              }

              // Set canvas size to match video
              canvas.width = video.videoWidth
              canvas.height = video.videoHeight

              // Draw video frame to canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

              // Get image data for QR code scanning
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

              // Scan for QR code
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
              })

              if (code) {
                // QR code found
                console.log("QR Code found:", code.data)
                if (mountedRef.current) {
                  onScanSuccess(code.data)
                }
                stopScanner()
                return
              }

              // Continue scanning
              if (mountedRef.current) {
                animationFrameId = requestAnimationFrame(scanFrame)
              }
            }

            scanFrame()
          } catch (playError) {
            console.error("Error playing video:", playError)
            if (mountedRef.current) {
              onScanError("Failed to start camera stream. Please try again.")
            }
          }
        }
      } catch (error) {
        console.error("Error starting scanner:", error)
        if (mountedRef.current) {
          onScanError("Failed to access camera. Please ensure you've granted camera permissions.")
        }
      }
    }

    const stopScanner = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
      }

      setScanning(false)
    }

    startScanner()

    // Cleanup function
    return () => {
      mountedRef.current = false
      stopScanner()
    }
  }, [onScanSuccess, onScanError])

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border aspect-square">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="absolute inset-0 border-2 border-dashed border-pink-400 m-8 rounded-lg pointer-events-none"></div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Scanning... Please position the QR code in the center of the frame.
      </p>

      <Button variant="outline" className="w-full" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )
}
