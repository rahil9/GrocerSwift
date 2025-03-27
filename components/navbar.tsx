"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, User, LogOut, Package, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Import the ThemeToggle component
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues by only showing dynamic content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show on auth pages
  if (pathname?.startsWith("/auth")) {
    return null
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U"

    const email = user.email
    const name = email.split("@")[0]

    if (name.length === 0) return "U"

    // If name has multiple parts (e.g., first.last), get initials of each part
    if (name.includes(".")) {
      return name
        .split(".")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2)
    }

    // Otherwise just return the first letter
    return name.charAt(0).toUpperCase()
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xl font-bold">GrocerSwift</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchForm />
        </div>

        {/* Add the ThemeToggle button to the navbar */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/cart" className="relative hidden md:block">
            <Button variant="outline" size="icon">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {mounted && totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>
          </Link>


          {mounted && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex w-full cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex w-full cursor-pointer items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="flex w-full cursor-pointer items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button>
                <span className="hidden md:inline">Login / Sign Up</span>
                <span className="md:hidden">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="md:hidden container pb-3">
        <SearchForm />
      </div>
    </header>
  )
}