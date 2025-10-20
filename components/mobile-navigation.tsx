"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

export function MobileNavigation() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues by only showing dynamic content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show on auth pages
  if (pathname?.startsWith("/auth")) {
    return null
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t py-2">
      <div className="flex items-center justify-around">
        <Link href="/" className="flex flex-col items-center">
          <div className={`p-1 rounded-full ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}>
            <Home className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link href="/products" className="flex flex-col items-center">
          <div
            className={`p-1 rounded-full ${pathname === "/products" || pathname?.startsWith("/products/") ? "text-primary" : "text-muted-foreground"}`}
          >
            <Search className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1">Search</span>
        </Link>

        <Link href="/wishlist" className="flex flex-col items-center">
          <div className={`p-1 rounded-full ${pathname === "/wishlist" ? "text-primary" : "text-muted-foreground"}`}>
            <Heart className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1">Wishlist</span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center relative">
          <div
            className={`p-1 rounded-full ${pathname === "/cart" || pathname?.startsWith("/checkout") ? "text-primary" : "text-muted-foreground"}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </Badge>
            )}
          </div>
          <span className="text-xs mt-1">Cart</span>
        </Link>

        <Link href={user ? "/profile" : "/auth"} className="flex flex-col items-center">
          <div
            className={`p-1 rounded-full ${pathname === "/profile" || pathname === "/auth" ? "text-primary" : "text-muted-foreground"}`}
          >
            <User className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1">{user ? "Profile" : "Login"}</span>
        </Link>
      </div>
    </div>
  )
}