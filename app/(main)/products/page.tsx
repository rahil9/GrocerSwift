"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Filter, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { getAllProducts, getProductsByCategory, searchProducts, type Product } from "@/lib/data"

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const searchParam = searchParams.get("search")
  const minPriceParam = searchParams.get("minPrice")
  const maxPriceParam = searchParams.get("maxPrice")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Load products based on URL parameters
  useEffect(() => {
    setLoading(true)

    let filteredProducts: Product[]

    // First check if we have a search query
    if (searchParam) {
      filteredProducts = searchProducts(searchParam)
    }
    // Then check if we have a category filter
    else if (categoryParam) {
      filteredProducts = getProductsByCategory(categoryParam)
    }
    // Otherwise, get all products
    else {
      filteredProducts = getAllProducts()
    }

    // Apply price filter if present
    if (minPriceParam || maxPriceParam) {
      const minPrice = minPriceParam ? Number.parseFloat(minPriceParam) : 0
      const maxPrice = maxPriceParam ? Number.parseFloat(maxPriceParam) : Number.POSITIVE_INFINITY

      filteredProducts = filteredProducts.filter((product) => product.price >= minPrice && product.price <= maxPrice)
    }

    setProducts(filteredProducts)
    setLoading(false)
  }, [categoryParam, searchParam, minPriceParam, maxPriceParam])

  // Handle reset all filters
  const handleResetAllFilters = () => {
    router.push("/products")
  }

  // Check if any filters are applied
  const hasFilters = !!(categoryParam || searchParam || minPriceParam || maxPriceParam)

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            {categoryParam
              ? `Browsing ${categoryParam.replace(/-/g, " ")} category`
              : searchParam
                ? `Search results for "${searchParam}"`
                : "Browse our selection of fresh groceries"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Mobile filters */}
        {showMobileFilters && (
          <div className="md:hidden">
            <ProductFilters currentCategory={categoryParam || ""} />
          </div>
        )}

        {/* Desktop filters */}
        <div className="hidden md:block">
          <ProductFilters currentCategory={categoryParam || ""} />
        </div>

        <div className="md:col-span-3">
          {/* Filter/search status and reset */}
          {hasFilters && (
            <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                {products.length} {products.length === 1 ? "result" : "results"} found
              </p>
              <span className="text-sm text-muted-foreground">{searchParam ? `Search: "${searchParam}"` : ""}</span>
            </div>
          )}

          {loading ? (
            <ProductsLoading />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  weight={product.weight}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
              <Filter className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium">No products found</h2>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search term</p>
              <Button onClick={handleResetAllFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}

