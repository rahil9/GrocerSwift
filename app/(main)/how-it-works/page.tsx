import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Truck, Clock, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function HowItWorksPage() {
  return (
    <div className="container py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">How QuickGrocer Works</h1>
        <p className="text-xl text-muted-foreground">
          Get your groceries delivered in minutes with our simple 4-step process
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          {
            icon: <ShoppingBag className="h-10 w-10 text-primary" />,
            title: "Browse & Select",
            description: "Browse through our wide selection of fresh groceries and add items to your cart.",
          },
          {
            icon: <CreditCard className="h-10 w-10 text-primary" />,
            title: "Place Order",
            description: "Review your cart, proceed to checkout, and complete your payment securely.",
          },
          {
            icon: <Clock className="h-10 w-10 text-primary" />,
            title: "We Prepare",
            description: "Our team carefully selects and packs your items to ensure freshness and quality.",
          },
          {
            icon: <Truck className="h-10 w-10 text-primary" />,
            title: "Fast Delivery",
            description: "Your order is delivered to your doorstep in minutes, not hours or days.",
          },
        ].map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 border rounded-lg bg-background">
            <div className="bg-primary/10 p-4 rounded-full mb-4">{step.icon}</div>
            <h3 className="text-xl font-medium mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
            <div className="mt-4 text-3xl font-bold text-primary">{index + 1}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=600" alt="Fresh groceries" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Fresh Groceries, Fast Delivery</h2>
          <p className="text-lg text-muted-foreground mb-6">
            We partner with local farms and suppliers to bring you the freshest produce, dairy, meat, and pantry
            essentials. Our delivery network ensures your groceries arrive at your doorstep in minutes, not hours.
          </p>
          <ul className="space-y-2 mb-6">
            {[
              "Delivery in as little as 10 minutes",
              "Fresh, high-quality products",
              "Wide selection of items",
              "Competitive pricing",
              "No minimum order value",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                {item}
              </li>
            ))}
          </ul>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-8 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Download our app or order directly from our website to experience the fastest grocery delivery service in your
          area.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button variant="outline" size="lg">
            Download App
          </Button>
        </div>
      </div>
    </div>
  )
}

