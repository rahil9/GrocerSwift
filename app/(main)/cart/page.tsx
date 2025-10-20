"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart()

  // Redirect to login if not authenticated
  useEffect(() => {
    // Only redirect if we're on the client side
    if (typeof window !== "undefined") {
      // If Firebase is not configured, don't redirect
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        // Just continue without authentication
        return
      }

      // Otherwise, redirect if not authenticated
      if (!user) {
        router.push("/auth?redirect=cart")
      }
    }
  }, [user, router])

  if (!user && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Please sign in to view your cart</h1>
          <p className="text-muted-foreground">You need to be logged in to access your cart</p>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Calculate standard shipping cost
  const standardShippingCost = totalPrice >= 1000 ? 0 : 200
  const tax = totalPrice * 0.1
  const totalWithStandardShipping = totalPrice + standardShippingCost + tax

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <span className="text-muted-foreground ml-2">({totalItems} items)</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12 border rounded-lg">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <p className="text-muted-foreground">Add items to your cart to see them here</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.weight}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border rounded-lg p-6 h-fit space-y-4">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{totalPrice >= 1000 ? "Free" : "₹200.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{totalWithStandardShipping.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

