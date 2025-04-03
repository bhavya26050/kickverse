"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"

export default function DevTools() {
  const [isOpen, setIsOpen] = useState(false)
  
  const checkMongoDB = async () => {
    try {
      const response = await fetch("/api/debug/mongodb")
      const data = await response.json()
      
      if (response.ok) {
        toast.success("MongoDB: Connected successfully")
      } else {
        toast.error(`MongoDB error: ${data.message}`)
      }
    } catch (error) {
      toast.error("Failed to check MongoDB connection")
    }
  }
  
  const checkGoogleAuth = async () => {
    try {
      const response = await fetch("/api/debug/google-config")
      const data = await response.json()
      
      if (response.ok) {
        toast.success("Google Auth: Config OK")
      } else {
        toast.error(`Google Auth config error: ${data.message}`)
      }
    } catch (error) {
      toast.error("Failed to check Google Auth config")
    }
  }
  
  const seedProducts = async () => {
    try {
      const response = await fetch("/api/seed")
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`Seeded ${data.count} products to DB`)
      } else {
        toast.error(`Seed error: ${data.message}`)
      }
    } catch (error) {
      toast.error("Failed to seed products")
    }
  }
  
  const checkWishlist = async () => {
    try {
      const response = await fetch("/api/debug/wishlist")
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`Wishlist has ${data.wishlistCount} items`)
        console.log("Wishlist debug info:", data)
      } else {
        toast.error(`Wishlist error: ${data.message}`)
      }
    } catch (error) {
      toast.error("Failed to check wishlist")
    }
  }
  
  const checkCart = async () => {
    try {
      // Check localStorage first
      const localCart = localStorage.getItem("cart")
      let localCartItems = []
      
      if (localCart) {
        try {
          localCartItems = JSON.parse(localCart)
          toast.success(`Local cart has ${localCartItems.length} items`)
          console.log("Local cart items:", localCartItems)
        } catch (e) {
          toast.error("Local cart data is corrupted")
          console.error("Local cart parse error:", e)
        }
      } else {
        toast.info("No local cart data found")
      }
      
      // Check server-side cart if logged in
      const response = await fetch("/api/debug/cart")
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Server cart has ${data.cartItemCount} items`)
        console.log("Server cart debug info:", data)
      } else {
        toast.info(`Server cart info: ${data.message}`)
      }
    } catch (error) {
      toast.error("Failed to check cart")
    }
  }
  
  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-black/80 backdrop-blur-md p-4 rounded-lg mb-2 border border-white/10 flex flex-col gap-2">
          <button 
            onClick={checkMongoDB}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Check MongoDB
          </button>
          <button 
            onClick={checkGoogleAuth}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Check Google Auth
          </button>
          <button 
            onClick={seedProducts}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Seed Products
          </button>
          <button 
            onClick={checkWishlist}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
          >
            Check Wishlist
          </button>
          <button 
            onClick={checkCart}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          >
            Check Cart
          </button>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/80 backdrop-blur-md text-white p-2 rounded-full border border-white/10 hover:bg-black/90"
      >
        🛠️
      </button>
    </div>
  )
}