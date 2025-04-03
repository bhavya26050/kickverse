"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, ShoppingBag, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SuccessPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    // If user navigates directly to success page without checkout, redirect to home
    const hasCompletedCheckout = localStorage.getItem("orderCompleted")
    const orderIdFromStorage = localStorage.getItem("lastOrderId")

    if (!hasCompletedCheckout) {
      router.push("/")
    } else {
      // Clear the flag after successful navigation
      localStorage.removeItem("orderCompleted")

      // Set the order ID if available
      if (orderIdFromStorage) {
        setOrderId(orderIdFromStorage)
        localStorage.removeItem("lastOrderId")
      }
    }
  }, [router])

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto glass-panel rounded-2xl p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-neon-purple/20 flex items-center justify-center">
              <CheckCircle className="text-neon-purple" size={40} />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Successful!</h1>

          <p className="text-white/70 mb-4 max-w-md mx-auto">
            Thank you for your purchase. Your order has been received and is being processed. You will receive a
            confirmation email shortly.
          </p>

          {orderId && (
            <div className="bg-white/10 rounded-lg p-4 mb-6 inline-block">
              <div className="flex items-center justify-center gap-2">
                <Package className="text-neon-purple" size={20} />
                <span className="font-medium">Order ID: {orderId}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white px-8 py-6 text-lg"
            >
              <Link href="/">Continue Shopping</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              <Link href="/profile/orders">
                <ShoppingBag className="mr-2 h-5 w-5" />
                View Orders
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

