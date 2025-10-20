"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Users, Package, BarChart3, Star, Trash2, Eye, Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getCategories } from "@/lib/data"
import { firebaseService, type FirestoreUser, type FirestoreOrder, type FirestoreProduct } from "@/lib/firebase-service"

// Form schema for product listing
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be positive"),
  image: z.string().url("Please enter a valid image URL"),
  category: z.string().min(1, "Category is required"),
  newCategory: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  discountPercentage: z.number().min(0).max(100, "Discount must be between 0-100"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  productDetails: z.string().min(10, "Product details are required"),
  storageInstructions: z.string().min(10, "Storage instructions are required"),
  nutritionFacts: z.object({
    calories: z.number().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
    fiber: z.number().min(0),
  }),
  rating: z.number().min(1).max(5),
})

type ProductFormData = z.infer<typeof productFormSchema>

export default function AdminPanel() {
  const { toast } = useToast()
  const categories = getCategories()
  const [activeTab, setActiveTab] = useState("list-product")

  // State for real data
  const [users, setUsers] = useState<FirestoreUser[]>([])
  const [orders, setOrders] = useState<FirestoreOrder[]>([])
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    processing: 0,
    outForDelivery: 0,
    delivered: 0,
    cancelled: 0
  })
  const [topCategories, setTopCategories] = useState<Array<{
    name: string
    orders: number
    revenue: number
  }>>([])
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch users
        const usersData = await firebaseService.getUsers()
        setUsers(usersData)

        // Fetch orders
        const ordersData = await firebaseService.getOrders()
        setOrders(ordersData)

        // Fetch order stats
        const stats = await firebaseService.getOrderStats()
        setOrderStats(stats)

        // Fetch top categories
        const categories = await firebaseService.getTopCategoriesByRevenue()
        setTopCategories(categories)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch data from database",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      image: "",
      category: "",
      quantity: 1,
      unit: "kg",
      discountPercentage: 0,
      description: "",
      productDetails: "",
      storageInstructions: "",
      nutritionFacts: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
      rating: 5,
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        name: data.name,
        price: data.price,
        image: data.image,
        category: data.category === "others" ? data.newCategory || "Others" : categories.find(c => c.id === data.category)?.name || "Others",
        categoryId: data.category === "others" ? "others" : data.category,
        weight: `${data.quantity} ${data.unit}`,
        description: data.description,
        productDetails: data.productDetails,
        storageInstructions: data.storageInstructions,
        nutritionFacts: data.nutritionFacts,
        rating: data.rating,
        discountPercentage: data.discountPercentage,
        quantity: data.quantity,
        unit: data.unit,
      }

      const productId = await firebaseService.addProduct(productData)
      
      if (productId) {
        toast({
          title: "Product Added Successfully",
          description: `${data.name} has been added to the catalog.`,
        })
        form.reset()
      } else {
        throw new Error("Failed to add product")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setUsersLoading(true)
    try {
      const success = await firebaseService.deleteUser(userId)
      if (success) {
        setUsers(users.filter(user => user.id !== userId))
        toast({
          title: "User Deleted",
          description: "User has been removed from the system.",
          variant: "destructive",
        })
      } else {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUsersLoading(false)
    }
  }

  const handleViewUser = async (userId: string) => {
    try {
      const user = await firebaseService.getUserById(userId)
      if (user) {
        toast({
          title: "User Profile",
          description: `Viewing profile for ${user.displayName || user.email}`,
        })
        // Here you could open a modal or navigate to a user profile page
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      toast({
        title: "Error",
        description: "Failed to load user profile.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage products, users, and orders</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list-product" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            List a Product
          </TabsTrigger>
          <TabsTrigger value="manage-users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manage Users
          </TabsTrigger>
          <TabsTrigger value="orders-dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Orders Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list-product" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>Fill in the details to add a new product to the catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="others">Others (Add New)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("category") === "others" && (
                      <FormField
                        control={form.control}
                        name="newCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Category Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter new category name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="g">g (grams)</SelectItem>
                              <SelectItem value="kg">kg (kilograms)</SelectItem>
                              <SelectItem value="L">L (liters)</SelectItem>
                              <SelectItem value="ml">ml (milliliters)</SelectItem>
                              <SelectItem value="piece">piece</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Percentage</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="10">10%</SelectItem>
                              <SelectItem value="15">15%</SelectItem>
                              <SelectItem value="20">20%</SelectItem>
                              <SelectItem value="25">25%</SelectItem>
                              <SelectItem value="30">30%</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Rating</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 Star</SelectItem>
                              <SelectItem value="2">2 Stars</SelectItem>
                              <SelectItem value="3">3 Stars</SelectItem>
                              <SelectItem value="4">4 Stars</SelectItem>
                              <SelectItem value="5">5 Stars</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter product description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="productDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="• Organic certified&#10;• Sourced from sustainable farms&#10;• Rich in nutrients&#10;• Perfect quality guaranteed&#10;• Country of origin: Local" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Use bullet points to list product features and details
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="storageInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Instructions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Store in a cool, dry place. Refrigerate after opening to maintain freshness." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Provide clear storage instructions for customers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Nutrition Facts (per 100g)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <FormField
                          control={form.control}
                          name="nutritionFacts.calories"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Calories</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="nutritionFacts.protein"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Protein (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="nutritionFacts.carbs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Carbs (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="nutritionFacts.fat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fat (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="nutritionFacts.fiber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fiber (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage-users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage registered users and their accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading users...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.displayName || user.profile?.firstName + " " + user.profile?.lastName || "N/A"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewUser(user.id)}
                              className="flex items-center gap-1"
                              disabled={usersLoading}
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="flex items-center gap-1"
                              disabled={usersLoading}
                            >
                              {usersLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders-dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    orderStats.totalOrders.toLocaleString()
                  )}
                </div>
                <p className="text-xs text-muted-foreground">All time orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                <Badge variant="secondary">Active</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    orderStats.processing
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Orders being processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out for Delivery</CardTitle>
                <Badge variant="outline">In Transit</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    orderStats.outForDelivery
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Orders in transit</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Categories by Revenue</CardTitle>
                <CardDescription>Best performing product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : topCategories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No category data available
                    </div>
                  ) : (
                    topCategories.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-sm font-bold text-primary">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">{category.orders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{category.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status Summary</CardTitle>
                <CardDescription>Current order distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Processing</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{orderStats.processing}</p>
                          <p className="text-xs text-muted-foreground">
                            {orderStats.totalOrders > 0 ? Math.round((orderStats.processing / orderStats.totalOrders) * 100) : 0}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">Out for Delivery</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{orderStats.outForDelivery}</p>
                          <p className="text-xs text-muted-foreground">
                            {orderStats.totalOrders > 0 ? Math.round((orderStats.outForDelivery / orderStats.totalOrders) * 100) : 0}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Delivered</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{orderStats.delivered}</p>
                          <p className="text-xs text-muted-foreground">
                            {orderStats.totalOrders > 0 ? Math.round((orderStats.delivered / orderStats.totalOrders) * 100) : 0}%
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between font-bold">
                        <span>Total Orders</span>
                        <span>{orderStats.totalOrders}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
