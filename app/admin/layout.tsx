import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { AdminAuth } from "@/components/admin-auth"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Baby Land - Admin Dashboard",
  description: "Baby Land admin dashboard for product and order management",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuth>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Logo />
            <span className="ml-2 text-sm font-semibold bg-pink-100 text-pink-800 px-2 py-0.5 rounded dark:bg-pink-900 dark:text-pink-200">
              Admin
            </span>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Link href="/shop" className="text-sm text-muted-foreground hover:underline mr-4">
                Go to Shop
              </Link>
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
          </div>
        </footer>
      </div>
    </AdminAuth>
  )
}
