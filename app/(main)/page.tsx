import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/category-card"
import { ProductCard } from "@/components/product-card"
import { HeroSection } from "@/components/hero-section"
import { getCategories, getFeaturedProducts } from "@/lib/data"

export default function Home() {
  const categories = getCategories()
  const trendingProducts = getFeaturedProducts("trending", 5)
  const essentialProducts = getFeaturedProducts("essentials", 5)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <section className="container py-8">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} name={category.name} image={category.image} slug={category.id} />
            ))}
          </div>
        </section>
        <section className="container py-8 bg-muted/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Trending Products</h2>
            <Link href="/products">
              <Button variant="link">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {trendingProducts.map((product) => (
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
        </section>
        <section className="container py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Daily Essentials</h2>
            <Link href="/products?category=essentials">
              <Button variant="link">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {essentialProducts.map((product) => (
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
        </section>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">GrocerSwift</h3>
              <p className="text-muted-foreground">Your one-stop shop for groceries delivered in minutes.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${category.id}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Help & Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                    Returns & Refunds
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Download Our App</h3>
              <p className="text-muted-foreground mb-4">Get groceries delivered in minutes with our mobile app.</p>
              <div className="flex gap-2">
                <Button variant="outline" className="w-full">
                  App Store
                </Button>
                <Button variant="outline" className="w-full">
                  Google Play
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} GrocerSwift. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

