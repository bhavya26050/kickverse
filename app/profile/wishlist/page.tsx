"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Heart, ArrowLeft, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"
import type { Product } from "@/types/product"

export default function WishlistPage() {
  const router = useRouter()
  const { session, status } = useAuth()
  const { addItem } = useCart()
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Fetch user wishlist
    const fetchWishlist = async () => {
      try {
        const response = await fetch("/api/user/wishlist")
        if (response.ok) {
          const data = await response.json()
          setWishlist(data.wishlist)
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchWishlist()
    }
  }, [status, router])

  // For demo purposes, let's create some mock wishlist items
  const mockWishlist: Product[] = [
    {
      id: "air-zoom-1",
      name: "Air Zoom Pulse",
      description: "The Air Zoom Pulse is designed for the modern athlete.",
      price: 129.99,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
      category: "men",
      subcategory: "running",
      sizes: ["7", "8", "9", "10", "11", "12"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "White", value: "#ffffff" },
        { name: "Red", value: "#ff0000" },
      ],
      stock: 15,
      isNew: true,
      rating: 4.5,
      reviews: 12,
    },
    {
      id: "cloud-runner-2",
      name: "Cloud Runner X",
      description: "The Cloud Runner X combines style and comfort.",
      price: 149.99,
      images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"],
      category: "women",
      subcategory: "running",
      sizes: ["5", "6", "7", "8", "9", "10"],
      colors: [
        { name: "Blue", value: "#0000ff" },
        { name: "Pink", value: "#ff69b4" },
        { name: "Gray", value: "#808080" },
      ],
      stock: 8,
      rating: 4.8,
      reviews: 24,
    },
  ]

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      // In a real app, you would call an API to remove from wishlist
      // For demo, we'll just filter the local state
      setWishlist(wishlist.filter((item) => item.id !== productId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0].value,
    })
    alert("Product added to cart!")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-purple"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-white/70 hover:text-white">
            <Link href="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          My <span className="text-gradient">Wishlist</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Saved Items
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-purple"></div>
            </div>
          ) : mockWishlist.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="mx-auto h-12 w-12 text-white/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-white/70 mb-4">Save items you like for later.</p>
              <Button asChild className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white">
                <Link href="/products/men">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockWishlist.map((product) => (
                <div
                  key={product.id}
                  className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="relative">
                    <Link href={`/products/${product.category}/${product.id}`}>
                      <div className="aspect-square rounded-lg overflow-hidden mb-4">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <p className="text-white/70 text-sm mb-2">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </p>
                  <p className="font-bold mb-4">${product.price.toFixed(2)}</p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

