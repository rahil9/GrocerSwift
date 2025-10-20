"use client"

import { useState } from "react"
import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  weight: string
}

export function ProductCard({ id, name, price, image, category, weight }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const [isInWishlistState, setIsInWishlistState] = useState(isInWishlist(id))

  // Calculate discount percentage (between 5% and 30%, multiple of 5)
  const getDiscountPercentage = () => {
    // Use product ID to generate a consistent discount
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    // Generate a number between 1 and 6 (for 5%, 10%, 15%, 20%, 25%, 30%)
    const multiplier = (hash % 6) + 1
    return multiplier * 5
  }

  const discountPercentage = getDiscountPercentage()
  const originalPrice = price * (100 / (100 - discountPercentage))

  // Update the handleAddToCart function to prevent navigation
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent default AND stop propagation
    e.stopPropagation()

    setIsAdding(true)

    // Add item to cart
    addToCart({
      id,
      name,
      price,
      image,
      category,
      weight,
      quantity: 1,
    })

    // Show toast notification
    toast({
      title: "Added to cart",
      description: (
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">₹{price.toFixed(2)}</p>
          </div>
        </div>
      ),
    })

    // Reset button state after a short delay
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  // Update the handleToggleWishlist function to prevent navigation
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent default AND stop propagation
    e.stopPropagation()

    // Check if user is logged in
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist",
        variant: "destructive",
      })
      return
    }

    if (isInWishlistState) {
      removeFromWishlist(id)
      setIsInWishlistState(false)
      toast({
        title: "Removed from wishlist",
        description: `${name} has been removed from your wishlist`,
      })
    } else {
      addToWishlist({
        id,
        name,
        price,
        image,
        category,
        categoryId: "",
        weight,
      })
      setIsInWishlistState(true)
      toast({
        title: "Added to wishlist",
        description: `${name} has been added to your wishlist`,
      })
    }
  }

  return (
    <Link href={`/products/${id}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-background transition-colors hover:bg-muted/50">
        <div className="relative aspect-square overflow-hidden">
          <Badge className="absolute top-2 right-2 z-10">{discountPercentage}% OFF</Badge>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 left-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isInWishlistState ? "fill-red-500 text-red-500" : ""}`} />
            <span className="sr-only">{isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}</span>
          </Button>
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium line-clamp-1">{name}</h3>
          <p className="text-xs text-muted-foreground">{weight}</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="font-bold">₹{price.toFixed(2)}</p>
              <p className="text-xs line-through text-muted-foreground">₹{originalPrice.toFixed(2)}</p>
            </div>
            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={handleAddToCart} disabled={isAdding}>
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Add to cart</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

