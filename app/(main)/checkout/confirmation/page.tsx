"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")

  // If no order number is provided, redirect to home
  useEffect(() => {
    if (!orderNumber) {
      window.location.href = "/"
    }
  }, [orderNumber])

  if (!orderNumber) {
    return null
  }

  return (
    <div className="container max-w-2xl py-12">
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. Your order number is <span className="font-medium">{orderNumber}</span>.
        </p>

        <div className="w-full max-w-md rounded-lg border p-6 mt-8">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span>{new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild>
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

