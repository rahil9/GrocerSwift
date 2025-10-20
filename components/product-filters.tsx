"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getCategories, getAllProducts } from "@/lib/data"

interface ProductFiltersProps {
  currentCategory: string
}

export function ProductFilters({ currentCategory }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const minPriceParam = searchParams.get("minPrice")
  const maxPriceParam = searchParams.get("maxPrice")

  // Get all products to determine the max price
  const allProducts = getAllProducts()
  const maxProductPrice = Math.max(...allProducts.map((product) => product.price))

  // Get price range from URL or use default
  const initialPriceRange = [
    minPriceParam ? Number.parseInt(minPriceParam) : 0,
    maxPriceParam ? Number.parseInt(maxPriceParam) : maxProductPrice,
  ]

  const [priceRange, setPriceRange] = useState(initialPriceRange)
  const [priceRangeChanged, setPriceRangeChanged] = useState(false)

  const categories = getCategories()

  // Update price range when URL params change
  useEffect(() => {
    if (!priceRangeChanged) {
      setPriceRange(initialPriceRange)
    }
  }, [minPriceParam, maxPriceParam, priceRangeChanged])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    // If we're already on this category and unchecking it, go to all products
    if (currentCategory === categoryId && !checked) {
      updateFilters({ category: null })
      return
    }

    // If checking a category, navigate to it
    if (checked) {
      updateFilters({ category: categoryId })
    }
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    setPriceRangeChanged(true)
  }

  const handlePriceRangeCommit = () => {
    updateFilters({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    })
  }

  const updateFilters = (updates: {
    category?: string | null
    minPrice?: string | null
    maxPrice?: string | null
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    // Handle category
    if (updates.category === null) {
      params.delete("category")
    } else if (updates.category) {
      params.set("category", updates.category)
    }

    // Handle price range
    if (updates.minPrice === null) {
      params.delete("minPrice")
    } else if (updates.minPrice) {
      params.set("minPrice", updates.minPrice)
    }

    if (updates.maxPrice === null) {
      params.delete("maxPrice")
    } else if (updates.maxPrice) {
      params.set("maxPrice", updates.maxPrice)
    }

    // Keep search parameter if it exists
    const searchParam = searchParams.get("search")
    if (searchParam) {
      params.set("search", searchParam)
    }

    router.push(`/products?${params.toString()}`)
  }

  const handleResetFilters = () => {
    // Reset all filters and show all products
    setPriceRange([0, maxProductPrice])
    setPriceRangeChanged(false)

    // Create a new URLSearchParams object instead of using clear()
    const params = new URLSearchParams()

    // Keep search parameter if it exists
    const searchParam = searchParams.get("search")
    if (searchParam) {
      params.set("search", searchParam)
    }

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={currentCategory === category.id}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Collapsible defaultOpen>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Price Range</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle price range</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-2">
          <div className="space-y-4">
            <Slider
              defaultValue={initialPriceRange}
              max={maxProductPrice}
              step={10}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              onValueCommit={handlePriceRangeCommit}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">₹{priceRange[0]}</span>
              <span className="text-sm">₹{priceRange[1]}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button className="w-full" onClick={handleResetFilters}>
        Reset Filters
      </Button>
    </div>
  )
}

