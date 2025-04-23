"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"

// The correct password
const ADMIN_PASSWORD = "1980"

// Key for storing auth state in localStorage
const AUTH_KEY = "babylandAdminAuth"

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already authenticated
  useEffect(() => {
    const authState = localStorage.getItem(AUTH_KEY)
    if (authState === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === ADMIN_PASSWORD) {
      // Store auth state in localStorage
      localStorage.setItem(AUTH_KEY, "true")
      setIsAuthenticated(true)
      setError(null)
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-14 items-center">
            <Logo />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter the admin password to access the dashboard</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">{error}</div>}

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
                >
                  Login
                </Button>
              </CardFooter>
            </form>
          </Card>
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

  // If authenticated, render children with logout button
  return (
    <div>
      <div className="fixed top-0 right-0 p-2 z-50">
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      {children}
    </div>
  )
}
