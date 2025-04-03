"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { ShoppingBag, ArrowRight, Plus, Minus, Trash2 } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity
  }, 0)

  const handleCheckout = async () => {
    if (items.length === 0) return

    try {
      setIsProcessing(true)

      // In a real app, you would redirect to checkout page
      // For demo, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to checkout
      window.location.href = "/checkout"
    } catch (error) {
      console.error("Error proceeding to checkout:", error)
      alert("Failed to proceed to checkout. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Your <span className="text-gradient">Shopping Cart</span>
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="flex justify-center mb-6">
              <ShoppingBag size={64} className="text-white/50" />
            </div>
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-white/70 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button
              asChild
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white px-8 py-6 text-lg"
            >
              <Link href="/products/men">Start Shopping</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="glass-panel rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Cart Items ({items.length})</h2>
                  <Button variant="ghost" className="text-white/70 hover:text-white" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div
                      key={`${item.productId}-${item.size}-${index}`}
                      className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-white/10"
                    >
                      <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-white/70 text-sm mt-1 space-y-1">
                          <p>Size: {item.size}</p>
                          <div className="flex items-center">
                            <span>Price: ${item.price?.toFixed(2) || "0.00"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateItemQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))
                            }
                            className="w-8 h-8 rounded-l-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="w-10 h-8 bg-white/5 flex items-center justify-center text-sm">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateItemQuantity(item.productId, item.size, item.quantity + 1)}
                            className="w-8 h-8 rounded-r-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="text-white/70 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="text-right font-medium">${((item.price || 0) * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="glass-panel rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/70">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Tax</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(totalPrice + totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white py-6 text-lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="mt-6">
                  <Button asChild variant="ghost" className="w-full text-white/70 hover:text-white">
                    <Link href="/products/men">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

