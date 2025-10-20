"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, CreditCard, Truck, MapPin, Calendar, Clock } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

// Define shipping info type
interface ShippingInfo {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  fullAddress?: string
  type?: string
}

// Define order type
interface Order {
  id: string
  date: string
  status: "delivered" | "processing" | "out for delivery"
  items: OrderItem[]
  total: number
  paymentMethod: string
  shippingInfo: ShippingInfo
  userId: string
  deliveryMethod?: string
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params)
  const orderId = unwrappedParams.id

  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Load order details
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      setLoading(true)

      const savedOrders = localStorage.getItem("userOrders")
      if (savedOrders) {
        try {
          const allOrders = JSON.parse(savedOrders)
          // Find the specific order for this user
          const userOrder = allOrders.find((o: Order) => o.id === orderId && o.userId === user.uid)

          if (userOrder) {
            // Check if order status should be updated based on time
            const orderDate = new Date(userOrder.date).getTime()
            const currentTime = Date.now()
            const secondsSinceOrder = (currentTime - orderDate) / 1000

            // Update order status based on delivery method and time
            const updatedOrder = { ...userOrder }

            if (userOrder.status === "processing") {
              // After 5s -> out for delivery; after 10s -> delivered
              if (secondsSinceOrder >= 10) {
                updatedOrder.status = "delivered"
              } else if (secondsSinceOrder >= 5) {
                updatedOrder.status = "out for delivery"
              }
            } else if (userOrder.status === "out for delivery") {
              if (secondsSinceOrder >= 10) {
                updatedOrder.status = "delivered"
              }
            }

            // If status changed, update in localStorage
            if (updatedOrder.status !== userOrder.status) {
              const updatedOrders = allOrders.map((o: Order) =>
                o.id === orderId && o.userId === user.uid ? updatedOrder : o,
              )
              localStorage.setItem("userOrders", JSON.stringify(updatedOrders))
            }

            setOrder(updatedOrder)
          } else {
            setNotFound(true)
          }
        } catch (error) {
          console.error("Failed to parse orders from localStorage:", error)
          setNotFound(true)
        }
      } else {
        setNotFound(true)
      }

      setLoading(false)
    }
  }, [orderId, user])

  // Periodically re-check and update order status based on elapsed time
  useEffect(() => {
    if (typeof window === "undefined" || !user) return

    const intervalId = setInterval(() => {
      const savedOrders = localStorage.getItem("userOrders")
      if (!savedOrders) return

      try {
        const allOrders = JSON.parse(savedOrders)
        const userOrder = allOrders.find((o: Order) => o.id === orderId && o.userId === user.uid)
        if (!userOrder) return

        const orderDate = new Date(userOrder.date).getTime()
        const currentTime = Date.now()
        const secondsSinceOrder = (currentTime - orderDate) / 1000

        const updatedOrder: Order = { ...userOrder }

        if (userOrder.status === "processing") {
          if (secondsSinceOrder >= 10) {
            updatedOrder.status = "delivered"
          } else if (secondsSinceOrder >= 5) {
            updatedOrder.status = "out for delivery"
          }
        } else if (userOrder.status === "out for delivery") {
          if (secondsSinceOrder >= 10) {
            updatedOrder.status = "delivered"
          }
        }

        if (updatedOrder.status !== userOrder.status) {
          const updatedOrders = allOrders.map((o: Order) =>
            o.id === orderId && o.userId === user.uid ? updatedOrder : o,
          )
          localStorage.setItem("userOrders", JSON.stringify(updatedOrders))
          setOrder(updatedOrder)
        }
      } catch (e) {
        // no-op
      }
    }, 1000) // check every second for snappy updates

    return () => clearInterval(intervalId)
  }, [orderId, user])

  // Redirect to login if not authenticated
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
          <p className="text-muted-foreground">You need to be logged in to access your order details</p>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to orders</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Order Not Found</h1>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-12 border rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-medium">Order not found</h2>
          <p className="text-muted-foreground">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild>
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
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

  // Calculate estimated delivery date based on 10-second delivery window
  const getEstimatedDeliveryDate = () => {
    if (!order) return ""

    const orderDate = new Date(order.date)

    const deliveryDate = new Date(orderDate.getTime() + 10 * 1000)
    return deliveryDate.toLocaleString()
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to orders</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      {order && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Order #{order.id}</h2>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {getPaymentMethodIcon(order.paymentMethod)}
                <span>{getPaymentMethodText(order.paymentMethod)}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Estimated Delivery: {getEstimatedDeliveryDate()}</span>
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>Items in your order</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 border">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          <p className="text-sm text-muted-foreground">{item.weight}</p>
                          <p className="text-sm">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{(order.total * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {order.deliveryMethod === "express" ? "₹200.00" : order.total > 1000 ? "Free" : "₹200.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{(order.total * 0.1).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      {order.shippingInfo.fullName && <p className="font-medium">{order.shippingInfo.fullName}</p>}
                      {order.shippingInfo.phone && <p className="text-sm">{order.shippingInfo.phone}</p>}
                      {order.shippingInfo.fullAddress ? (
                        <p className="text-sm text-muted-foreground mt-1">{order.shippingInfo.fullAddress}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state} -{" "}
                          {order.shippingInfo.zipCode}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}