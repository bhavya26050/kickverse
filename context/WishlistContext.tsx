"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "./AuthContext"

type WishlistContextType = {
  wishlist: string[]
  isLoading: boolean
  toggleWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, status } = useAuth()

  // Fetch wishlist on initial load or when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (status === "authenticated" && user) {
        try {
          setIsLoading(true)
          const response = await fetch("/api/user/wishlist")
          
          if (response.ok) {
            const data = await response.json()
            if (data.wishlist) {
              setWishlist(data.wishlist.map((product: any) => product.product_id))
            }
          } else {
            console.error("Failed to fetch wishlist")
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (status === "unauthenticated") {
        // Load from localStorage if not logged in
        try {
          const savedWishlist = localStorage.getItem("wishlist")
          if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist))
          }
        } catch (error) {
          console.error("Failed to load wishlist from localStorage:", error)
        }
      }
    }

    fetchWishlist()
  }, [user, status])

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, status])

  const toggleWishlist = async (productId: string) => {
    if (status === "authenticated") {
      try {
        setIsLoading(true)
        const response = await fetch("/api/user/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        })

        const data = await response.json()
        
        if (response.ok) {
          if (data.inWishlist) {
            setWishlist((prev) => [...prev, productId])
            toast.success("Added to wishlist")
          } else {
            setWishlist((prev) => prev.filter((id) => id !== productId))
            toast.success("Removed from wishlist")
          }
        } else {
          toast.error(data.message || "Failed to update wishlist")
        }
      } catch (error) {
        console.error("Error toggling wishlist:", error)
        toast.error("Failed to update wishlist")
      } finally {
        setIsLoading(false)
      }
    } else {
      // Handle wishlist for non-logged in users using localStorage
      if (wishlist.includes(productId)) {
        setWishlist((prev) => prev.filter((id) => id !== productId))
        toast.success("Removed from wishlist")
      } else {
        setWishlist((prev) => [...prev, productId])
        toast.success("Added to wishlist")
      }
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}