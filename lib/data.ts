// Mock data for products and categories

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  categoryId: string
  weight: string
  description?: string
  featured?: string[]
}

export interface Category {
  id: string
  name: string
  image: string
}

// Categories data
const categories: Category[] = [
  {
    id: "fruits-vegetables",
    name: "Fruits & Vegetables",
    image: "https://domf5oio6qrcr.cloudfront.net/medialibrary/11499/3b360279-8b43-40f3-9b11-604749128187.jpg",
  },
  {
    id: "dairy-breakfast",
    name: "Dairy & Breakfast",
    image: "https://static.virtubox.io/project/file/20210510-063214-w19i-dairy-breakfast.png",
  },
  {
    id: "bakery",
    name: "Bakery",
    image: "https://assets.architecturaldigest.in/photos/60084fd13829163dc3ab540b/16:9/w_2560%2Cc_limit/Mumbai-bakery-breads-1366x768.jpg",
  },
  {
    id: "meat-seafood",
    name: "Meat & Seafood",
    image: "https://t3.ftcdn.net/jpg/01/18/84/52/360_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg",
  },
  {
    id: "snacks-beverages",
    name: "Snacks & Beverages",
    image: "https://framerusercontent.com/images/fGgSRoGt5aR7BkFZiE41WAyHTP0.jpg",
  },
  {
    id: "household",
    name: "Household Items",
    image: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1500,ar_3:2/k%2FPhoto%2FSeries%2F2020-07-South-Indian-Chritra-Agrawal%2FPantry%20%2FSouth_Indian_grocery_items",
  },
  {
    id: "personal-care",
    name: "Personal Care",
    image: "https://cdn.prod.website-files.com/6556a292d56eb873329f5c20/6556a292d56eb873329f5ca4_Santax-Personal-care.jpg",
  },
  {
    id: "instant-food",
    name: "Instant Food",
    image: "https://cdn.thewirecutter.com/wp-content/media/2024/12/TT-INSTANT-NOODLES-2048px-5957-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp",
  },
]

// Products data
const products: Product[] = [
  {
    id: "product-1",
    name: "Organic Bananas",
    price: 120,
    image: "https://images-cdn.ubuy.co.in/650c519f6058624e4066f751-marketside-fresh-organic-bananas-bunch.jpg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    weight: "1 kg",
    description: "Fresh organic bananas sourced from sustainable farms.",
    featured: ["trending", "essentials"],
  },
  {
    id: "product-2",
    name: "Fresh Milk",
    price: 60,
    image: "https://images.stockcake.com/public/e/1/f/e1f26bd7-b99b-40aa-a70b-391071b294ec_large/fresh-milk-outside-stockcake.jpg",
    category: "Dairy & Breakfast",
    categoryId: "dairy-breakfast",
    weight: "1 L",
    description: "Farm-fresh whole milk, pasteurized and homogenized.",
    featured: ["essentials"],
  },
  {
    id: "product-3",
    name: "Whole Wheat Bread",
    price: 40,
    image: "https://images.getrecipekit.com/20230728144103-md-100-whole-wheat-bread-11-1-of-1-scaled.jpg?aspect_ratio=4:3&quality=90&",
    category: "Bakery",
    categoryId: "bakery",
    weight: "400 g",
    description: "Freshly baked whole wheat bread with no preservatives.",
    featured: ["essentials"],
  },
  {
    id: "product-4",
    name: "Chicken Breast",
    price: 220,
    image: "https://www.greenchickchop.in/cdn/shop/files/ChickenBreastBoneless.webp?v=1682572347",
    category: "Meat & Seafood",
    categoryId: "meat-seafood",
    weight: "500 g",
    description: "Boneless, skinless chicken breast from free-range chickens.",
  },
  {
    id: "product-5",
    name: "Avocado",
    price: 80,
    image: "https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2022/04/pexels-antonio-filigno-8538296-1024x657.jpg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    weight: "1 piece",
    description: "Ripe Hass avocados, perfect for guacamole or toast.",
    featured: ["trending"],
  },
  {
    id: "product-6",
    name: "Greek Yogurt",
    price: 90,
    image: "https://epigamiastore.com/cdn/shop/files/GY_400g_Natural_Pack_of_1.png?v=1739179817",
    category: "Dairy & Breakfast",
    categoryId: "dairy-breakfast",
    weight: "500 g",
    description: "Creamy Greek yogurt, high in protein and probiotics.",
    featured: ["trending"],
  },
  {
    id: "product-7",
    name: "Organic Eggs",
    price: 120,
    image: "https://www.greendna.in/cdn/shop/products/Brown-eggs1_1024x1024@2x.jpg?v=1627154548",
    category: "Dairy & Breakfast",
    categoryId: "dairy-breakfast",
    weight: "12 pcs",
    description: "Farm-fresh organic eggs from free-range hens.",
    featured: ["essentials"],
  },
  {
    id: "product-8",
    name: "Tomatoes",
    price: 50,
    image: "https://tagawagardens.com/wp-content/uploads/2023/08/TOMATOES-RED-RIPE-VINE-SS-1-1024x681.jpg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    weight: "500 g",
    description: "Vine-ripened tomatoes, perfect for salads and cooking.",
  },
  {
    id: "product-9",
    name: "Potato Chips",
    price: 65,
    image: "https://m.media-amazon.com/images/I/514xVUdk6ML._AC_UF894,1000_QL80_.jpg",
    category: "Snacks & Beverages",
    categoryId: "snacks-beverages",
    weight: "200 g",
    description: "Crispy potato chips with a touch of sea salt.",
    featured: ["trending"],
  },
  {
    id: "product-10",
    name: "Chocolate Bar",
    price: 60,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi0h8UOVw9QS8bmxl7xs65qQpfoQq8NbRvuA&s",
    category: "Snacks & Beverages",
    categoryId: "snacks-beverages",
    weight: "100 g",
    description: "Premium dark chocolate with 70% cocoa content.",
  },
  {
    id: "product-11",
    name: "Dishwashing Liquid",
    price: 80,
    image: "https://cpimg.tistatic.com/03885363/b/24/Dishwashing-Liquid-1Ltr.jpg",
    category: "Household",
    categoryId: "household",
    weight: "750 ml",
    description: "Effective dishwashing liquid that cuts through grease.",
  },
  {
    id: "product-12",
    name: "Toilet Paper",
    price: 140,
    image: "https://rukminim3.flixcart.com/image/850/1000/ktn9pjk0/toilet-paper-roll/s/7/r/toilet-tissue-rolls-with-100-natural-tissue-extra-soft-tissue-original-imag6xqgxpqb3xpg.jpeg?q=90&crop=false",
    category: "Household",
    categoryId: "household",
    weight: "12 rolls",
    description: "Soft and strong toilet paper, septic-safe.",
    featured: ["essentials"],
  },
  {
    id: "product-13",
    name: "Apples",
    price: 70,
    image: "https://cdn.britannica.com/22/187222-050-07B17FB6/apples-on-a-tree-branch.jpg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    weight: "1 kg",
    description: "Crisp and sweet apples, perfect for snacking.",
    featured: ["trending", "essentials"],
  },
  {
    id: "product-14",
    name: "Orange Juice",
    price: 85,
    image: "https://zamaorganics.com/cdn/shop/files/Untitleddesign_35_d63fc2f8-c7c4-430e-89fa-0ac1b84f7cfc_11zon.png?v=1694675707&width=1080",
    category: "Snacks & Beverages",
    categoryId: "snacks-beverages",
    weight: "1 L",
    description: "100% pure orange juice, not from concentrate.",
    featured: ["essentials"],
  },
  {
    id: "product-15",
    name: "Toothpaste",
    price: 60,
    image: "https://www.nyccd.com/wp-content/uploads/2021/10/Pros-and-Cons-of-Different-Types-of-Toothpaste-3.jpg",
    category: "Personal Care",
    categoryId: "personal-care",
    weight: "100 g",
    description: "Fluoride toothpaste for cavity protection and fresh breath.",
  },
  {
    id: "product-16",
    name: "Instant Noodles",
    price: 30,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfqjidnSsp4T72aiCbklKci8WFhJoYXCCBHw&s",
    category: "Instant Food",
    categoryId: "instant-food",
    weight: "85 g",
    description: "Quick and easy instant noodles, ready in 3 minutes.",
    featured: ["trending"],
  },
]

// Get all categories
export function getCategories(): Category[] {
  return categories
}

// Get all products
export function getAllProducts(): Product[] {
  return products
}

// Get products by category
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((product) => product.categoryId === categoryId)
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

// Get featured products
export function getFeaturedProducts(feature: string, limit?: number): Product[] {
  const featuredProducts = products.filter((product) => product.featured && product.featured.includes(feature))

  return limit ? featuredProducts.slice(0, limit) : featuredProducts
}

// Search products
export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm),
  )
}

