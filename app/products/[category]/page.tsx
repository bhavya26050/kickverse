"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import ProductCard from "@/components/ProductCard"
import { toast } from "react-hot-toast"
import { Product } from "@/types/product"

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError("")
        
        console.log(`Fetching products for category: ${category}`)
        const response = await fetch(`/api/products?category=${category}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Products data:", data)
        
        if (!Array.isArray(data)) {
          console.error("API didn't return an array:", data)
          setProducts([])
          return
        }
        
        setProducts(data)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        toast.error("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchProducts()
    }
  }, [category])

  // Format category name for display
  const formattedCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : ""

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {formattedCategory}'s <span className="text-gradient">Collection</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Discover our latest {formattedCategory.toLowerCase()} sneakers designed for style and performance
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-purple"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-neon-purple text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl">No products found in this category.</p>
            <p className="mt-2 text-white/70">Check back later or explore other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.product_id} 
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

