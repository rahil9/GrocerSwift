"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Package, ArrowLeft, ChevronDown, ChevronUp, CreditCard, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"

// Define order item type
interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  category: string
  weight: string
}

// Define order type
interface Order {
  id: string
  date: string
  status: "delivered" | "processing" | "out for delivery"
  items: OrderItem[]
  total: number
  paymentMethod: string
  userId: string
  deliveryMethod?: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load orders (from localStorage in this demo)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(true)

      // If user is logged in, load their orders
      if (user) {
        const savedOrders = localStorage.getItem("userOrders")
        if (savedOrders) {
          try {
            const allOrders = JSON.parse(savedOrders)
            // Filter orders for current user and sort by date (newest first)
            const userOrders = allOrders
              .filter((order: Order) => order.userId === user.uid)
              .sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime())
            setOrders(userOrders)
          } catch (error) {
            console.error("Failed to parse orders from localStorage:", error)
            setOrders([])
          }
        } else {
          setOrders([])
        }
      }

      setLoading(false)
    }
  }, [user])

  // Periodically refresh orders to reflect status transitions
  useEffect(() => {
    if (typeof window === "undefined" || !user) return

    const intervalId = setInterval(() => {
      const savedOrders = localStorage.getItem("userOrders")
      if (!savedOrders) return

      try {
        const allOrders: Order[] = JSON.parse(savedOrders)
        const updatedAllOrders = allOrders.map((o: any) => {
          const orderDate = new Date(o.date).getTime()
          const currentTime = Date.now()
          const secondsSinceOrder = (currentTime - orderDate) / 1000
          const updated = { ...o }
          if (o.status === "processing") {
            if (secondsSinceOrder >= 10) updated.status = "delivered"
            else if (secondsSinceOrder >= 5) updated.status = "out for delivery"
          } else if (o.status === "out for delivery") {
            if (secondsSinceOrder >= 10) updated.status = "delivered"
          }
          return updated
        })

        if (JSON.stringify(updatedAllOrders) !== savedOrders) {
          localStorage.setItem("userOrders", JSON.stringify(updatedAllOrders))
        }

        const userOrders = updatedAllOrders
          .filter((order: Order) => order.userId === user.uid)
          .sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setOrders(userOrders)
      } catch {
        // ignore
      }
    }, 1000) // every second

    return () => clearInterval(intervalId)
  }, [user])

  // Redirect to login if not authenticated (wait for auth to finish)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // If Firebase is not configured, don't redirect
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        return
      }

      // Otherwise, redirect if not authenticated
      if (!authLoading && !user) {
        router.push("/auth?redirect=orders")
      }
    }
  }, [user, authLoading, router])

  if (!user && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Package className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Please sign in to view your orders</h1>
          <p className="text-muted-foreground">You need to be logged in to access your order history</p>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400"
      case "processing":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
      case "out for delivery":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit-card":
        return <CreditCard className="h-4 w-4" />
      case "cash":
        return <Truck className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit-card":
        return "Credit Card"
      case "cash":
        return "Cash on Delivery"
      default:
        return method
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Your Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12 border rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-medium">No orders yet</h2>
          <p className="text-muted-foreground">You haven't placed any orders yet</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Collapsible
              key={order.id}
              open={expandedOrder === order.id}
              onOpenChange={() => toggleOrderExpand(order.id)}
              className="border rounded-lg overflow-hidden"
            >
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">₹{order.total.toFixed(2)}</p>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Toggle order details</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              <CollapsibleContent>
                <Separator />
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Payment Method:</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getPaymentMethodIcon(order.paymentMethod)}
                      <span>{getPaymentMethodText(order.paymentMethod)}</span>
                    </Badge>
                  </div>

                  <h4 className="font-medium">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm">
                              {item.quantity} × ₹{item.price.toFixed(2)}
                            </p>
                            <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  )
}

