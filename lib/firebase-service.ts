"use client"

import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  addDoc, 
  updateDoc,
  query,
  orderBy,
  where,
  limit,
  getDoc,
  type DocumentData,
  type QuerySnapshot,
  type DocumentSnapshot
} from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { initializeApp, getApps, getApp } from "firebase/app"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app
let db

if (typeof window !== "undefined") {
  try {
    if (!getApps().length) {
      if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your-api-key-here") {
        console.warn("Firebase is not configured. Database features will be disabled.")
      } else {
        app = initializeApp(firebaseConfig)
        db = getFirestore(app)
      }
    } else {
      app = getApp()
      db = getFirestore(app)
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// TypeScript interfaces for Firestore data
export interface FirestoreUser {
  id: string
  email: string
  displayName?: string
  createdAt: string
  lastLoginAt?: string
  isAdmin?: boolean
  profile?: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
  }
}

export interface FirestoreOrder {
  id: string
  userId: string
  userEmail: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  totalAmount: number
  status: 'processing' | 'out-for-delivery' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: 'pending' | 'completed' | 'failed'
}

export interface FirestoreProduct {
  id: string
  name: string
  price: number
  image: string
  category: string
  categoryId: string
  weight: string
  description: string
  productDetails: string
  storageInstructions: string
  nutritionFacts: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  rating: number
  discountPercentage: number
  quantity: number
  unit: string
  createdAt: string
  updatedAt: string
  featured?: string[]
}

// Database service functions
export class FirebaseService {
  private static instance: FirebaseService
  private db: any

  constructor() {
    this.db = db
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService()
    }
    return FirebaseService.instance
  }

  // User management functions
  async getUsers(): Promise<FirestoreUser[]> {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching users:", error)
      return []
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      
      return true
    } catch (error) {
      console.error("Error deleting user:", error)
      return false
    }
  }

  async getUserById(userId: string): Promise<FirestoreUser | null> {
    try {
      const users = await this.getUsers()
      return users.find(user => user.id === userId) || null
    } catch (error) {
      console.error("Error fetching user:", error)
      return null
    }
  }

  // Order management functions
  async getOrders(): Promise<FirestoreOrder[]> {
    if (!this.db) {
      console.warn("Firebase not initialized")
      return []
    }

    try {
      const ordersRef = collection(this.db, "orders")
      const q = query(ordersRef, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreOrder[]
    } catch (error) {
      console.error("Error fetching orders:", error)
      return []
    }
  }

  async getOrdersByStatus(status: string): Promise<FirestoreOrder[]> {
    if (!this.db) {
      console.warn("Firebase not initialized")
      return []
    }

    try {
      const ordersRef = collection(this.db, "orders")
      const q = query(ordersRef, where("status", "==", status))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreOrder[]
    } catch (error) {
      console.error("Error fetching orders by status:", error)
      return []
    }
  }

  async getOrderStats(): Promise<{
    totalOrders: number
    processing: number
    outForDelivery: number
    delivered: number
    cancelled: number
  }> {
    if (!this.db) {
      console.warn("Firebase not initialized")
      return {
        totalOrders: 0,
        processing: 0,
        outForDelivery: 0,
        delivered: 0,
        cancelled: 0
      }
    }

    try {
      const orders = await this.getOrders()
      
      return {
        totalOrders: orders.length,
        processing: orders.filter(order => order.status === 'processing').length,
        outForDelivery: orders.filter(order => order.status === 'out-for-delivery').length,
        delivered: orders.filter(order => order.status === 'delivered').length,
        cancelled: orders.filter(order => order.status === 'cancelled').length
      }
    } catch (error) {
      console.error("Error fetching order stats:", error)
      return {
        totalOrders: 0,
        processing: 0,
        outForDelivery: 0,
        delivered: 0,
        cancelled: 0
      }
    }
  }

  async getTopCategoriesByRevenue(): Promise<Array<{
    name: string
    orders: number
    revenue: number
  }>> {
    if (!this.db) {
      console.warn("Firebase not initialized")
      return []
    }

    try {
      const orders = await this.getOrders()
      const categoryStats = new Map<string, { orders: number, revenue: number }>()

      orders.forEach(order => {
        order.items.forEach(item => {
          // Assuming we have category information in the item
          const category = item.name.split(' ')[0] // Simple category extraction
          const existing = categoryStats.get(category) || { orders: 0, revenue: 0 }
          existing.orders += item.quantity
          existing.revenue += item.price * item.quantity
          categoryStats.set(category, existing)
        })
      })

      return Array.from(categoryStats.entries())
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3)
    } catch (error) {
      console.error("Error fetching top categories:", error)
      return []
    }
  }

  // Product management functions
  async addProduct(product: Omit<FirestoreProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    if (!this.db) {
      console.warn("Firebase not initialized")
      return null
    }

    try {
      const now = new Date().toISOString()
      const productData = {
        ...product,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(this.db, "products"), productData)
      return docRef.id
    } catch (error) {
      console.error("Error adding product:", error)
      return null
    }
  }

  async getProducts(): Promise<FirestoreProduct[]> {
    if (!this.db) {
      console.warn("Firebase not initialized")
      return []
    }

    try {
      const productsRef = collection(this.db, "products")
      const snapshot = await getDocs(productsRef)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreProduct[]
    } catch (error) {
      console.error("Error fetching products:", error)
      return []
    }
  }

  async updateProduct(productId: string, updates: Partial<FirestoreProduct>): Promise<boolean> {
    if (!this.db) {
      console.warn("Firebase not initialized")
      return false
    }

    try {
      const productRef = doc(this.db, "products", productId)
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      return true
    } catch (error) {
      console.error("Error updating product:", error)
      return false
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    if (!this.db) {
      console.warn("Firebase not initialized")
      return false
    }

    try {
      await deleteDoc(doc(this.db, "products", productId))
      return true
    } catch (error) {
      console.error("Error deleting product:", error)
      return false
    }
  }
}

// Export singleton instance
export const firebaseService = FirebaseService.getInstance()
