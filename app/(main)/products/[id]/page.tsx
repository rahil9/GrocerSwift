"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { getProductById } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params)
  const productId = unwrappedParams.id

  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [isInWishlistState, setIsInWishlistState] = useState(false)
  const { user } = useAuth()

  // Get product data
  const product = getProductById(productId)
  const [productFound, setProductFound] = useState(true)

  // If product not found, redirect to products page
  useEffect(() => {
    let isMounted = true

    if (!product) {
      if (typeof window !== "undefined" && isMounted) {
        router.push("/products")
      }
      if (isMounted) {
        setProductFound(false)
      }
    }

    return () => {
      isMounted = false
    }
  }, [product, router])

  // Check if product is in wishlist
  useEffect(() => {
    if (product) {
      setIsInWishlistState(isInWishlist(product.id))
    }
  }, [product, isInWishlist])

  if (!productFound || !product) {
    return null
  }

  // Product images (using placeholder for demo)
  const productImages = [
    product.image,
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ]

  // Calculate discount percentage (between 5% and 30%, multiple of 5)
  const getDiscountPercentage = () => {
    // Use product ID to generate a consistent discount
    const hash = product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    // Generate a number between 1 and 6 (for 5%, 10%, 15%, 20%, 25%, 30%)
    const multiplier = (hash % 6) + 1
    return multiplier * 5
  }

  const discountPercentage = getDiscountPercentage()
  const originalPrice = product.price * (100 / (100 - discountPercentage))

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      weight: product.weight,
      quantity,
    })

    toast({
      title: "Added to cart",
      description: (
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div>
            <p className="font-medium">
              {quantity} × {product.name}
            </p>
            <p className="text-xs text-muted-foreground">₹{(product.price * quantity).toFixed(2)}</p>
          </div>
        </div>
      ),
    })
  }

  const handleToggleWishlist = () => {
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
      removeFromWishlist(product.id)
      setIsInWishlistState(false)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      })
    } else {
      addToWishlist(product)
      setIsInWishlistState(true)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      })
    }
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/products">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <span className="text-muted-foreground">
          Products / {product.category} / {product.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={productImages[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* <div className="flex gap-2 overflow-auto pb-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div> */}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= 4 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">(12 reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-3xl font-bold">₹{product.price.toFixed(2)}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm line-through text-muted-foreground">₹{originalPrice.toFixed(2)}</p>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                {discountPercentage}% OFF
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{product.weight} • In Stock</p>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground">
              {product.description || "Fresh quality product delivered to your doorstep."}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none rounded-l-md"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <div className="w-12 text-center">{quantity}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none rounded-r-md"
                onClick={increaseQuantity}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant={isInWishlistState ? "default" : "outline"}
              size="icon"
              onClick={handleToggleWishlist}
              className={isInWishlistState ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className={`h-5 w-5 ${isInWishlistState ? "fill-white" : ""}`} />
              <span className="sr-only">{isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}</span>
            </Button>
          </div>

          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span>Free delivery on orders over ₹1000</span>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex-1">
                Nutrition
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4 space-y-4">
              <div>
                <h3 className="font-medium">Product Details</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Organic certified</li>
                  <li>• Sourced from sustainable farms</li>
                  <li>• Rich in nutrients</li>
                  <li>• Perfect quality guaranteed</li>
                  <li>• Country of origin: Local</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Storage Instructions</h3>
                <p className="mt-2 text-sm">
                  Store in a cool, dry place. Refrigerate after opening to maintain freshness.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="nutrition" className="pt-4">
              <h3 className="font-medium mb-4">Nutrition Facts (per 100g)</h3>
              <div className="space-y-2">
                {[
                  { key: "calories", value: "89 kcal" },
                  { key: "protein", value: "1.1 g" },
                  { key: "carbs", value: "22.8 g" },
                  { key: "fat", value: "0.3 g" },
                  { key: "fiber", value: "2.6 g" },
                ].map(({ key, value }) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="capitalize">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Customer Reviews</h3>
                <Button variant="outline" size="sm">
                  Write a Review
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: "review-1",
                    user: "Sarah T.",
                    rating: 5,
                    date: "2023-10-15",
                    comment: "Great quality product! Will buy again.",
                  },
                  {
                    id: "review-2",
                    user: "Michael R.",
                    rating: 4,
                    date: "2023-09-28",
                    comment: "Good value for money, fast delivery.",
                  },
                  {
                    id: "review-3",
                    user: "Jessica L.",
                    rating: 5,
                    date: "2023-09-10",
                    comment: "Excellent freshness and taste. Highly recommend!",
                  },
                ].map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {review.user.charAt(0)}
                        </div>
                        <span className="font-medium">{review.user}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}