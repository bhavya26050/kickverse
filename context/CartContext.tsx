"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { CartItem } from "@/types/product"
import { toast } from "react-hot-toast"

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string) => void
  updateItemQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [total, setTotal] = useState(0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Ensure all items have required properties
        const validatedCart = parsedCart.map((item: CartItem) => ({
          ...item,
          price: item.price || 0,
          quantity: item.quantity || 1
        }));
        setItems(validatedCart)
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
      // If there's an error, let's reset the cart
      localStorage.removeItem("cart")
    }
  }, [])

  // Update localStorage and calculated values whenever items change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
      setItemCount(items.reduce((count, item) => count + item.quantity, 0))
      setTotal(items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  const addItem = (newItem: CartItem) => {
    if (!newItem.price) {
      toast.error("Invalid item price")
      return
    }
    
    setItems((prevItems) => {
      // Check if the item with same productId and size exists
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productId === newItem.productId && item.size === newItem.size
      )

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (newItem.quantity || 1),
        }
        toast.success(`${newItem.name} quantity updated in cart!`)
        return updatedItems
      } else {
        // Item doesn't exist, add it
        toast.success(`${newItem.name} added to cart!`)
        return [...prevItems, {
          ...newItem,
          quantity: newItem.quantity || 1
        }]
      }
    })
  }

  const removeItem = (productId: string, size: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) => item.productId === productId && item.size === size
      )
      
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from cart`)
      }
      
      return prevItems.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    })
  }

  const updateItemQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size)
      return
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    toast.success("Cart cleared")
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

