import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Update the generateQRValue function to ensure consistent format
export function generateQRValue(productCode: string): string {
  // Create a simple format that's easy to parse: just the product code
  // The scanner will handle the routing
  return productCode
}
