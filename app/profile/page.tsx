"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { ShoppingBag, Heart, User, Package, Clock, Calendar } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { session, status } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Fetch user orders
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/user/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchOrders()
    }
  }, [status, router])

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
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          My <span className="text-gradient">Profile</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="glass-panel rounded-2xl p-6 sticky top-24">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neon-purple mb-4">
                  <Image
                    src={session?.user?.image || "/placeholder.svg?height=96&width=96"}
                    alt={session?.user?.name || "User"}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{session?.user?.name}</h2>
                <p className="text-white/70 text-sm">{session?.user?.email}</p>
              </div>

              <nav className="space-y-2">
                <Link href="/profile" className="flex items-center p-3 rounded-lg bg-white/10 text-white">
                  <User className="mr-3 h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/profile/orders"
                  className="flex items-center p-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <Package className="mr-3 h-5 w-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/profile/wishlist"
                  className="flex items-center p-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <Heart className="mr-3 h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center p-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  <span>Cart</span>
                </Link>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="glass-panel rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white/70 text-sm mb-1">Full Name</h3>
                  <p className="font-medium">{session?.user?.name || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="text-white/70 text-sm mb-1">Email</h3>
                  <p className="font-medium">{session?.user?.email || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="text-white/70 text-sm mb-1">Account Created</h3>
                  <p className="font-medium">
                    <Calendar className="inline mr-1 h-4 w-4" />
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-white/70 text-sm mb-1">Login Method</h3>
                  <p className="font-medium">Google</p>
                </div>
              </div>

              <div className="mt-6">
                <Button className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white">
                  Edit Profile
                </Button>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Recent Orders
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-purple"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="mx-auto h-12 w-12 text-white/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-white/70 mb-4">You haven't placed any orders yet.</p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white"
                  >
                    <Link href="/products/men">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* This would normally map through actual orders */}
                  <div className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <h3 className="font-medium">Order #ORD123456</h3>
                        <p className="text-white/70 text-sm flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          Placed on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Delivered</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                          alt="Product"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Air Zoom Pulse</h4>
                        <p className="text-white/70 text-sm">Size: 10 • Qty: 1</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$129.99</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" className="text-white/70 hover:text-white border-white/20">
                        View Details
                      </Button>
                      <Button className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white">
                        Buy Again
                      </Button>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <h3 className="font-medium">Order #ORD123457</h3>
                        <p className="text-white/70 text-sm flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          Placed on {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Processing</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
                          alt="Product"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Cloud Runner X</h4>
                        <p className="text-white/70 text-sm">Size: 9 • Qty: 1</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$149.99</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" className="text-white/70 hover:text-white border-white/20">
                        View Details
                      </Button>
                      <Button className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white">
                        Track Order
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link href="/profile/orders" className="text-neon-blue hover:underline">
                  View All Orders
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

