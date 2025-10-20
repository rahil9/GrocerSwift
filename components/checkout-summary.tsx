import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "@/lib/cart-context"

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotal: number
  deliveryMethod: string
}

export function CheckoutSummary({ items, subtotal, deliveryMethod }: CheckoutSummaryProps) {
  // Calculate shipping cost based on subtotal and delivery method
  const getShippingCost = () => {
    // For express delivery
    if (deliveryMethod === "express") {
      // If order is above ₹1000, only charge express fee (₹200)
      if (subtotal >= 1000) {
        return 200
      }
      // If order is below ₹1000, charge standard fee + express fee (₹400)
      return 400
    }

    // For standard delivery
    // Free delivery for orders above ₹1000
    if (subtotal >= 1000) {
      return 0
    }

    // Standard delivery costs ₹200 for orders below ₹1000
    return 200
  }

  const shippingCost = getShippingCost()
  const tax = subtotal * 0.1
  const total = subtotal + shippingCost + tax

  return (
    <div className="border rounded-lg p-6 space-y-4 sticky top-4">
      <h2 className="text-lg font-medium">Order Summary</h2>

      <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium line-clamp-1">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.weight}</p>
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

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {deliveryMethod === "express"
              ? subtotal >= 1000
                ? "₹200.00 (Express)"
                : "₹400.00 (All Inclusive)"
              : shippingCost === 0
                ? "Free"
                : "₹200.00"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

