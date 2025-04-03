"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "react-hot-toast"

type CartItem = {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
  category?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize with localStorage data if available
  const [items, setItems] = useState<CartItem[]>(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems")
      return storedCart ? JSON.parse(storedCart) : []
    }
    return []
  })
  
  // Count total items in cart
  const itemCount = items.reduce((total, item) => total + (item.quantity || 1), 0)

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(items))
      console.log("Cart updated:", items)
    }
  }, [items])

  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if item exists with same productId, size, and color
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item.productId === newItem.productId && 
          item.size === newItem.size && 
          item.color === newItem.color
      )

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        toast.success(`Updated ${newItem.name} quantity in cart`)
        return updatedItems
      } else {
        // Add new item
        toast.success(`Added ${newItem.name} to cart`)
        return [...prevItems, newItem]
      }
    })
  }

  // Remove item from cart
  const removeItem = (productId: string, size?: string, color?: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => 
          !(item.productId === productId && 
            item.size === size && 
            item.color === color)
      )
      return updatedItems
    })
  }

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (
          item.productId === productId && 
          item.size === size && 
          item.color === color
        ) {
          return { ...item, quantity }
        }
        return item
      })
    })
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cartItems")
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

