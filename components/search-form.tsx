"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchProducts, type Product } from "@/lib/data"

export function SearchForm() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowRecommendations(false)
    }
  }

  // Update recommendations as user types
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = searchProducts(searchQuery.trim())
      setRecommendations(results.slice(0, 5)) // Limit to 5 recommendations
      setShowRecommendations(true)
    } else {
      setRecommendations([])
      setShowRecommendations(false)
    }
  }, [searchQuery])

  // Close recommendations when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecommendations(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("")
    setRecommendations([])
    setShowRecommendations(false)
  }

  // Handle product click
  const handleProductClick = (productId: string) => {
    setShowRecommendations(false)
    router.push(`/products/${productId}`)
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative w-full">
        <Input
          type="text" // Changed from "search" to "text" to avoid browser's built-in clear button
          placeholder="Search products..."
          className="w-full pr-16"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (recommendations.length > 0) {
              setShowRecommendations(true)
            }
          }}
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-8 top-0 h-full"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>

      {/* Search recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-background shadow-md">
          <div className="p-2">
            <h3 className="px-2 py-1.5 text-sm font-medium text-muted-foreground">Suggestions</h3>
            <div className="mt-1">
              {recommendations.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted text-left"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-md border">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-sm font-medium">₹{product.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t">
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={handleSearch}>
                <Search className="mr-2 h-3.5 w-3.5" />
                Search for "{searchQuery}"
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

