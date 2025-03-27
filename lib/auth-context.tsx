"use client"

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
  Auth,
} from "firebase/auth"
import { initializeApp, getApps, getApp } from "firebase/app"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only on client side and only if not already initialized
let app
let auth: Auth

// Only initialize Firebase on the client side
if (typeof window !== "undefined") {
  try {
    // Check if Firebase apps have already been initialized
    if (!getApps().length) {
      // Check if API key is available
      if (!firebaseConfig.apiKey) {
        console.error("Firebase API key is missing. Please check your environment variables.")
      } else {
        app = initializeApp(firebaseConfig)
      }
    } else {
      app = getApp() // Use the already initialized app
    }

    auth = getAuth(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only set up auth state listener if auth is initialized
    if (typeof window !== "undefined" && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user)
        setLoading(false)
      })

      return () => unsubscribe()
    } else {
      // If auth is not initialized, just set loading to false
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase authentication is not initialized")
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase authentication is not initialized")
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signOut = async () => {
    if (!auth) {
      throw new Error("Firebase authentication is not initialized")
    }

    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

