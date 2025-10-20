"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, ArrowLeft, Package, Heart, LogOut, Plus, Trash2, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, signOut } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    addresses: [],
  })

  // New address state
  const [newAddress, setNewAddress] = useState<Omit<Address, "id" | "isDefault">>({
    type: "Home",
    fullAddress: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
  })

  // Check if profile is complete
  useEffect(() => {
    const isComplete = profile.name.trim() !== "" && profile.phone.trim() !== "" && profile.addresses.length > 0

    setIsProfileComplete(isComplete)
  }, [profile])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      // If Firebase is not configured, don't redirect
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        return
      }

      // Otherwise, redirect if not authenticated
      if (!user) {
        router.push("/auth?redirect=profile")
      } else {
        // Set email from user
        setProfile((prev) => ({
          ...prev,
          email: user.email || "",
          name: user.displayName || "",
        }))

        // Load profile from localStorage if available
        const savedProfile = localStorage.getItem("userProfile")
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile)
            if (parsedProfile.email === user.email) {
              setProfile(parsedProfile)
            }
          } catch (error) {
            console.error("Failed to parse profile from localStorage:", error)
          }
        }
      }
    }
  }, [user, router])

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!profile.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your full name",
        variant: "destructive",
      })
      return
    }

    if (!profile.phone.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!profile.email.trim() || !emailPattern.test(profile.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Save profile to localStorage
    localStorage.setItem("userProfile", JSON.stringify(profile))

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
      setIsLoading(false)
      setIsEditing(false) // Exit edit mode after saving
    }, 1000)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  // Handle new address input change
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAddress((prev) => ({ ...prev, [name]: value }))
  }

  // Handle address type change
  const handleAddressTypeChange = (value: string) => {
    setNewAddress((prev) => ({ ...prev, type: value }))
  }

  // Add new address
  const handleAddAddress = () => {
    // Validate address fields
    if (
      !newAddress.street.trim() ||
      !newAddress.city.trim() ||
      !newAddress.state.trim() ||
      !newAddress.pinCode.trim()
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all address fields",
        variant: "destructive",
      })
      return
    }

    // Check if we already have 3 addresses
    if (profile.addresses.length >= 3 && !editingAddressId) {
      toast({
        title: "Address limit reached",
        description: "You can only have up to 3 addresses. Please delete an existing address first.",
        variant: "destructive",
      })
      return
    }

    const fullAddress = `${newAddress.street}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pinCode}`

    let updatedProfile

    if (editingAddressId) {
      // Update existing address
      updatedProfile = {
        ...profile,
        addresses: profile.addresses.map((addr) =>
          addr.id === editingAddressId
            ? {
                ...addr,
                type: newAddress.type,
                street: newAddress.street,
                city: newAddress.city,
                state: newAddress.state,
                pinCode: newAddress.pinCode,
                fullAddress,
              }
            : addr,
        ),
      }
      setProfile(updatedProfile)
      setEditingAddressId(null)
    } else {
      // Add new address
      const newAddr: Address = {
        id: Date.now().toString(),
        type: newAddress.type,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        pinCode: newAddress.pinCode,
        fullAddress,
        isDefault: profile.addresses.length === 0, // First address is default
      }

      updatedProfile = {
        ...profile,
        addresses: [...profile.addresses, newAddr],
      }
      setProfile(updatedProfile)
    }

    // Save to localStorage immediately
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

    // Reset form
    setNewAddress({
      type: "Home",
      fullAddress: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
    })
    setShowAddressForm(false)

    toast({
      title: editingAddressId ? "Address updated" : "Address added",
      description: editingAddressId
        ? "Your address has been updated successfully"
        : "Your address has been added successfully",
    })
  }

  // Edit address
  const handleEditAddress = (address: Address) => {
    setNewAddress({
      type: address.type,
      fullAddress: address.fullAddress,
      street: address.street,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
    })
    setEditingAddressId(address.id)
    setShowAddressForm(true)
  }

  // Delete address
  const handleDeleteAddress = (id: string) => {
    const isDefault = profile.addresses.find((addr) => addr.id === id)?.isDefault

    setProfile((prev) => {
      const updatedAddresses = prev.addresses.filter((addr) => addr.id !== id)

      // If we deleted the default address, make the first one default
      if (isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true
      }

      // Save the updated profile to localStorage
      const updatedProfile = {
        ...prev,
        addresses: updatedAddresses,
      }

      localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

      return updatedProfile
    })

    toast({
      title: "Address deleted",
      description: "Your address has been deleted successfully",
    })
  }

  // Set default address
  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = profile.addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }))

    const updatedProfile = {
      ...profile,
      addresses: updatedAddresses,
    }

    // Save to localStorage immediately
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

    // Update state
    setProfile(updatedProfile)

    toast({
      title: "Default address updated",
      description: "Your default address has been updated successfully",
    })
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile.name) {
      return profile.name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2)
    }

    if (!user?.email) return "U"

    const email = user.email
    const name = email.split("@")[0]

    if (name.length === 0) return "U"

    // If name has multiple parts (e.g., first.last), get initials of each part
    if (name.includes(".")) {
      return name
        .split(".")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2)
    }

    // Otherwise just return the first letter
    return name.charAt(0).toUpperCase()
  }

  if (!user && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <User className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
          <p className="text-muted-foreground">You need to be logged in to access your profile</p>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
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
        <h1 className="text-2xl font-bold">Your Profile</h1>
      </div>

      {!isProfileComplete && (
        <div className="mb-8 p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">Complete Your Profile</h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please complete your profile by adding your full name, contact number, and at least one address to enable
            checkout.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-medium">{profile.name || "User"}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <Separator />
            <div className="w-full space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/orders">
                  <Package className="mr-2 h-4 w-4" />
                  Your Orders
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">{isEditing ? "Cancel" : "Edit"}</span>
              </Button>
            </CardHeader>
            <CardContent>
              <form id="profile-form" onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full legal name"
                      required
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your number"
                      required
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              {isEditing && (
                <Button type="submit" form="profile-form" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Addresses</CardTitle>
                <CardDescription>Manage your delivery addresses</CardDescription>
              </div>
              {profile.addresses.length < 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingAddressId(null)
                    setNewAddress({
                      type: "Home",
                      fullAddress: "",
                      street: "",
                      city: "",
                      state: "",
                      pinCode: "",
                    })
                    setShowAddressForm(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Address
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {profile.addresses.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">You haven't added any addresses yet</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingAddressId(null)
                      setNewAddress({
                        type: "Home",
                        fullAddress: "",
                        street: "",
                        city: "",
                        state: "",
                        pinCode: "",
                      })
                      setShowAddressForm(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.addresses.map((address) => (
                    <div key={address.id} className="flex flex-col border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="font-medium">{address.type}</span>
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Address</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this address? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{address.fullAddress}</p>
                      {!address.isDefault && (
                        <Button
                          variant="link"
                          size="sm"
                          className="self-start p-0 h-auto text-xs"
                          onClick={() => handleSetDefaultAddress(address.id)}
                        >
                          Set as default
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingAddressId ? "Edit Address" : "Add New Address"}</DialogTitle>
                    <DialogDescription>
                      {editingAddressId
                        ? "Update your address details below"
                        : "Fill in the details for your new address"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Address Type</Label>
                      <RadioGroup
                        value={newAddress.type}
                        onValueChange={handleAddressTypeChange}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Home" id="home" />
                          <Label htmlFor="home" className="font-normal">
                            Home
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Work" id="work" />
                          <Label htmlFor="work" className="font-normal">
                            Work
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Other" id="other" />
                          <Label htmlFor="other" className="font-normal">
                            Other
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street">
                        Street Address <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="street"
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressInputChange}
                        placeholder="123 Main St, Apartment 4B"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">
                          City <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressInputChange}
                          placeholder="Mumbai"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">
                          State <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressInputChange}
                          placeholder="Maharashtra"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pinCode">
                        PIN Code <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="pinCode"
                        name="pinCode"
                        value={newAddress.pinCode}
                        onChange={handleAddressInputChange}
                        placeholder="400001"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddressForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAddress}>{editingAddressId ? "Update Address" : "Add Address"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

