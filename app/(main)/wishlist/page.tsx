"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"

export default function WishlistPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, clearWishlist } = useWishlist()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      // If Firebase is not configured, don't redirect
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        return
      }

      // Otherwise, redirect if not authenticated
      if (!user) {
        router.push("/auth?redirect=wishlist")
      }
    }
  }, [user, router])

  if (!user && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Heart className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Please sign in to view your wishlist</h1>
          <p className="text-muted-foreground">You need to be logged in to access your wishlist</p>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Your Wishlist</h1>
        <span className="text-muted-foreground ml-2">({items.length} items)</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12 border rounded-lg">
          <Heart className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-medium">Your wishlist is empty</h2>
          <p className="text-muted-foreground">Add items to your wishlist to see them here</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button variant="outline" onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                weight={product.weight}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

