import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Baby Land - Shop",
  description: "Baby Land products and ordering",
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/shop/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Baby Land. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              Home
            </Link>
            <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
