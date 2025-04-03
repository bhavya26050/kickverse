"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart, CartItem } from "@/context/CartContext"
import { Button } from "@/components/ui/button"

interface CartDrawerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function CartDrawer({ isOpen, setIsOpen }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  
  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      
      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <motion.div
          className="w-screen max-w-md"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex h-full flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between px-4 py-6 sm:px-6">
              <h2 className="text-lg font-medium">Your Cart</h2>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Button onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-2 sm:px-6">
                  <ul className="divide-y divide-border">
                    <AnimatePresence initial={false}>
                      {cart.map((item) => (
                        <CartItem 
                          key={item._id} 
                          item={item} 
                          removeFromCart={removeFromCart}
                          updateQuantity={updateQuantity}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
                
                <div className="border-t border-border px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium mb-4">
                    <p>Subtotal</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <Link href="/checkout">
                    <Button className="w-full" onClick={() => setIsOpen(false)}>
                      Checkout
                    </Button>
                  </Link>
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => {
                        clearCart()
                        setIsOpen(false)
                      }}
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function CartItem({ 
  item, 
  removeFromCart, 
  updateQuantity 
}: { 
  item: CartItem
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
}) {
  return (
    <motion.li
      className="py-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex items-center">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
          <Image
            src={item.images[0]}
            alt={item.name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium">
              <Link
                href={`/products/${item.category}/${item._id}`}
                className="hover:text-primary"
              >
                {item.name}
              </Link>
            </h3>
            <p className="text-sm font-medium ml-4">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
          
          <p className="mt-1 text-xs text-muted-foreground capitalize">{item.category}</p>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center border rounded-md">
              <button
                className="px-2 py-1 text-sm"
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-2 py-1 text-sm">{item.quantity}</span>
              <button
                className="px-2 py-1 text-sm"
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={() => removeFromCart(item._id)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  )
}
