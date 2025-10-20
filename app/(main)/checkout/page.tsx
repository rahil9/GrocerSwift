"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Truck, Home, Building, MapPin, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { CheckoutSummary } from "@/components/checkout-summary"

// Define address type
interface Address {
  id: string
  type: string
  fullAddress: string
  street: string
  city: string
  state: string
  pinCode: string
  isDefault: boolean
}

// Define profile type
interface UserProfile {
  name: string
  email: string
  phone: string
  addresses: Address[]
}

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { items, totalPrice, clearCart } = useCart()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState("shipping")
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [showAddAddressForm, setShowAddAddressForm] = useState(false)
  const [tempAddressOnly, setTempAddressOnly] = useState(false)

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  })

  const [deliveryMethod, setDeliveryMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  // Load user profile
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      const savedProfile = localStorage.getItem("userProfile")
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile)
          if (parsedProfile.email === user.email) {
            setUserProfile(parsedProfile)

            // Pre-fill shipping info
            setShippingInfo({
              fullName: parsedProfile.name || "",
              email: parsedProfile.email || "",
              phone: parsedProfile.phone || "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
            })

            // Set default address if available
            const defaultAddress = parsedProfile.addresses.find((addr: Address) => addr.isDefault)
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id)
            } else if (parsedProfile.addresses.length > 0) {
              setSelectedAddressId(parsedProfile.addresses[0].id)
            }

            // Check if profile is complete
            const isComplete = parsedProfile.name && parsedProfile.phone && parsedProfile.addresses.length > 0

            setIsProfileComplete(isComplete)
          }
        } catch (error) {
          console.error("Failed to parse profile from localStorage:", error)
        }
      }
    }
  }, [user])

  // Redirect to profile if not complete
  useEffect(() => {
    if (userProfile && !isProfileComplete) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile before proceeding to checkout",
        variant: "destructive",
      })
      router.push("/profile")
    }
  }, [userProfile, isProfileComplete, router, toast])

  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If using saved address
    if (selectedAddressId && userProfile) {
      const selectedAddress = userProfile.addresses.find((addr) => addr.id === selectedAddressId)
      if (!selectedAddress) {
        toast({
          title: "Error",
          description: "Please select a valid address",
          variant: "destructive",
        })
        return
      }
    } else {
      // Basic validation for manual address
      if (
        !shippingInfo.fullName ||
        !shippingInfo.email ||
        !shippingInfo.phone ||
        !shippingInfo.address ||
        !shippingInfo.city ||
        !shippingInfo.state ||
        !shippingInfo.zipCode
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
    }

    // Move to payment step
    setActiveStep("payment")
  }

  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation for credit card
    if (paymentMethod === "credit-card") {
      if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        toast({
          title: "Missing information",
          description: "Please fill in all required payment fields",
          variant: "destructive",
        })
        return
      }
    }

    // Process order
    handlePlaceOrder()
  }

  // Calculate shipping cost based on subtotal and delivery method
  const getShippingCost = () => {
    // For express delivery
    if (deliveryMethod === "express") {
      // If order is above ₹1000, only charge express fee (₹200)
      if (totalPrice >= 1000) {
        return 200
      }
      // If order is below ₹1000, charge standard fee + express fee (₹400)
      return 400
    }

    // For standard delivery
    // Free delivery for orders above ₹1000
    if (totalPrice >= 1000) {
      return 0
    }

    // Standard delivery costs ₹200 for orders below ₹1000
    return 200
  }

  // Handle place order
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Calculate total with shipping
      const subtotal = totalPrice
      const shippingCost = getShippingCost()
      const tax = subtotal * 0.1
      const total = subtotal + shippingCost + tax

      // Generate order data
      const orderData = {
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        date: new Date().toISOString(),
        items: items,
        total: total,
        shippingInfo:
          selectedAddressId && userProfile
            ? userProfile.addresses.find((addr) => addr.id === selectedAddressId)
            : shippingInfo,
        paymentMethod,
        status: "processing",
        userId: user?.uid || "guest",
        deliveryMethod,
      }

      // Save order to localStorage
      const savedOrders = localStorage.getItem("userOrders")
      let orders = []

      if (savedOrders) {
        try {
          orders = JSON.parse(savedOrders)
        } catch (error) {
          console.error("Failed to parse orders from localStorage:", error)
        }
      }

      orders.push(orderData)
      localStorage.setItem("userOrders", JSON.stringify(orders))

      // Fire-and-forget email confirmation (don't block UX)
      try {
        const emailTo = user?.email || (userProfile?.email ?? "")
        if (emailTo) {
          const itemsHtml = orderData.items
            .map(
              (it) =>
                `<tr><td style=\"padding:6px 8px;border-bottom:1px solid #eee\">${it.name} × ${it.quantity}</td><td style=\"padding:6px 8px;border-bottom:1px solid #eee;text-align:right\">₹${(it.price * it.quantity).toFixed(
                  2,
                )}</td></tr>`,
            )
            .join("")

          const html = `
            <div style=\"font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;padding:16px\">
              <h2 style=\"margin:0 0 12px\">Order Confirmation #${orderData.id}</h2>
              <p style=\"margin:0 0 16px;color:#555\">Thanks for your order placed on ${new Date(
                orderData.date,
              ).toLocaleString()}.</p>
              <table style=\"width:100%;border-collapse:collapse\">${itemsHtml}</table>
              <p style=\"margin:16px 0 0;font-weight:600\">Total: ₹${orderData.total.toFixed(2)}</p>
            </div>`

          fetch("/api/send-order-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: emailTo, subject: `Your Order #${orderData.id}`, html }),
          }).catch(() => {})
        }
      } catch {}

      // Clear cart and redirect to confirmation
      clearCart()

      // Redirect to confirmation page
      router.push(`/checkout/confirmation?order=${orderData.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your order",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update shipping info
  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Update payment info
  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Function to save a new address
  const handleSaveNewAddress = () => {
    // Validate address fields
    if (
      !shippingInfo.address.trim() ||
      !shippingInfo.city.trim() ||
      !shippingInfo.state.trim() ||
      !shippingInfo.zipCode.trim()
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all address fields",
        variant: "destructive",
      })
      return
    }

    // Check if we already have 3 addresses
    if (userProfile.addresses.length >= 3) {
      setTempAddressOnly(true)
      toast({
        title: "Address limit reached",
        description: "You already have 3 addresses saved. This address will be used for this order only.",
      })
      return
    }

    const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zipCode}`

    // Create new address
    const newAddr = {
      id: Date.now().toString(),
      type: "Home",
      street: shippingInfo.address,
      city: shippingInfo.city,
      state: shippingInfo.state,
      pinCode: shippingInfo.zipCode,
      fullAddress,
      isDefault: userProfile.addresses.length === 0, // First address is default
    }

    // Update profile with new address
    const updatedAddresses = [...userProfile.addresses, newAddr]
    const updatedProfile = {
      ...userProfile,
      addresses: updatedAddresses,
    }

    // Save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

    // Update state
    setUserProfile(updatedProfile)
    setSelectedAddressId(newAddr.id)
    setShowAddAddressForm(false)

    toast({
      title: "Address added",
      description: "Your new address has been added successfully",
    })
  }

  // If cart is empty, redirect to products
  if (items.length === 0) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center space-y-4 py-12 border rounded-lg">
          <Truck className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <p className="text-muted-foreground">Add items to your cart before proceeding to checkout</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  // If profile is not loaded yet, show loading
  if (!userProfile) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center space-y-4 py-12 border rounded-lg">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <h2 className="text-xl font-medium">Loading your profile...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cart">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to cart</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={activeStep} className="w-full" onValueChange={setActiveStep}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shipping" disabled={isSubmitting}>
                Shipping
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={activeStep !== "payment" && activeStep !== "confirmation"}>
                Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="space-y-4 pt-4">
              <form onSubmit={handleShippingSubmit}>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingInfoChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={handleShippingInfoChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={handleShippingInfoChange}
                          placeholder="9876543210"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-lg font-medium">Shipping Address</h2>

                    {userProfile.addresses.length > 0 && (
                      <div className="mt-4 mb-6">
                        <Label className="mb-2 block">Select a saved address</Label>
                        <RadioGroup
                          value={selectedAddressId}
                          onValueChange={setSelectedAddressId}
                          className="space-y-3"
                        >
                          {userProfile.addresses.map((address) => (
                            <div
                              key={address.id}
                              className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                                selectedAddressId === address.id ? "border-primary bg-primary/5" : ""
                              }`}
                              onClick={() => setSelectedAddressId(address.id)}
                            >
                              <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <Label htmlFor={`address-${address.id}`} className="font-medium cursor-pointer">
                                    {address.type}
                                  </Label>
                                  {address.isDefault && (
                                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{address.fullAddress}</p>
                              </div>
                              {address.type === "Home" && <Home className="h-5 w-5 text-muted-foreground" />}
                              {address.type === "Work" && <Building className="h-5 w-5 text-muted-foreground" />}
                              {address.type === "Other" && <MapPin className="h-5 w-5 text-muted-foreground" />}
                            </div>
                          ))}
                        </RadioGroup>

                        {/* <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            setSelectedAddressId("")
                            setShowAddAddressForm(true)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Address
                        </Button> */}
                      </div>
                    )}

                    {(selectedAddressId === "" || userProfile.addresses.length === 0 || showAddAddressForm) && (
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Textarea
                            id="address"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleShippingInfoChange}
                            placeholder="123 Main St, Apt 4B"
                            required={!selectedAddressId}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              value={shippingInfo.city}
                              onChange={handleShippingInfoChange}
                              placeholder="Mumbai"
                              required={!selectedAddressId}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              name="state"
                              value={shippingInfo.state}
                              onChange={handleShippingInfoChange}
                              placeholder="Maharashtra"
                              required={!selectedAddressId}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">PIN Code</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              value={shippingInfo.zipCode}
                              onChange={handleShippingInfoChange}
                              placeholder="400001"
                              required={!selectedAddressId}
                            />
                          </div>
                        </div>

                        {showAddAddressForm && (
                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowAddAddressForm(false)
                                if (userProfile.addresses.length > 0) {
                                  setSelectedAddressId(userProfile.addresses[0].id)
                                }
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleSaveNewAddress}>
                              {userProfile.addresses.length >= 3 ? "Use for this order only" : "Save Address"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-lg font-medium">Delivery Method</h2>
                    <RadioGroup
                      defaultValue="standard"
                      value={deliveryMethod}
                      onValueChange={setDeliveryMethod}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                    >
                      <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="font-normal">
                            Standard Delivery
                          </Label>
                        </div>
                        <p className="text-sm font-medium">{totalPrice >= 1000 ? "Free" : "₹200.00"}</p>
                      </div>
                      <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="font-normal">
                            Express Delivery
                          </Label>
                        </div>
                        <p className="text-sm font-medium">{totalPrice >= 1000 ? "₹200.00" : "₹400.00"}</p>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4 pt-4">
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium">Payment Method</h2>
                    <RadioGroup
                      defaultValue="credit-card"
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-4">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="font-normal flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-4">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="font-normal">
                          Cash on Delivery
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "credit-card" && (
                    <>
                      <Separator />

                      <div>
                        <h2 className="text-lg font-medium">Card Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              value={paymentInfo.cardNumber}
                              onChange={handlePaymentInfoChange}
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input
                              id="cardName"
                              name="cardName"
                              value={paymentInfo.cardName}
                              onChange={handlePaymentInfoChange}
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              value={paymentInfo.expiryDate}
                              onChange={handlePaymentInfoChange}
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              value={paymentInfo.cvv}
                              onChange={handlePaymentInfoChange}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveStep("shipping")}
                      disabled={isSubmitting}
                    >
                      Back to Shipping
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <CheckoutSummary items={items} subtotal={totalPrice} deliveryMethod={deliveryMethod} />
        </div>
      </div>
    </div>
  )
}

