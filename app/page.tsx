import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ShoppingBag, LayoutDashboard } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-14 items-center">
          <Logo />
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-pink-50 dark:from-background dark:to-blue-950/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
                    Baby Land
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Welcome to Baby Land's online ordering system. Choose which section you'd like to access.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
                  >
                    <Link href="/shop" className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Customer Shop
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Baby Land. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
