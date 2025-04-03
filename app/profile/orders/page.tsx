"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { ShoppingBag, Package, Clock, ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function OrdersPage() {
  const router = useRouter()
  const { session, status } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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

  // For demo purposes, let's create some mock orders
  const mockOrders = [
    {
      id: "ORD123456",
      date: new Date(),
      status: "delivered",
      total: 129.99,
      items: [
        {
          id: "air-zoom-1",
          name: "Air Zoom Pulse",
          price: 129.99,
          size: "10",
          color: "Black",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        },
      ],
    },
    {
      id: "ORD123457",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "processing",
      total: 149.99,
      items: [
        {
          id: "cloud-runner-2",
          name: "Cloud Runner X",
          price: 149.99,
          size: "9",
          color: "Blue",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
        },
      ],
    },
    {
      id: "ORD123458",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      status: "delivered",
      total: 239.98,
      items: [
        {
          id: "street-force-3",
          name: "Street Force Pro",
          price: 119.99,
          size: "11",
          color: "Green",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329",
        },
        {
          id: "flex-motion-4",
          name: "Flex Motion Elite",
          price: 119.99,
          size: "10",
          color: "Purple",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
        },
      ],
    },
  ]

  // Filter orders based on search term
  const filteredOrders = mockOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
          My <span className="text-gradient">Orders</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Order History
            </h2>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 focus-visible:ring-neon-purple"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-purple"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-white/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-white/70 mb-4">
                {searchTerm ? "No orders match your search criteria." : "You haven't placed any orders yet."}
              </p>
              <Button asChild className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white">
                <Link href="/products/men">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-white/10 rounded-lg p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div>
                      <h3 className="font-medium text-lg">Order #{order.id}</h3>
                      <p className="text-white/70 text-sm flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        Placed on {order.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          order.status === "delivered"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "processing"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="ml-4 font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-wrap gap-4 pb-4 border-b border-white/10">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-white/70 text-sm">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4 justify-between">
                    <Button asChild variant="outline" className="text-white/70 hover:text-white border-white/20">
                      <Link href={`/profile/orders/${order.id}`}>View Details</Link>
                    </Button>
                    <div className="space-x-4">
                      {order.status === "delivered" && (
                        <Button className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white">
                          Buy Again
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white">
                          Track Order
                        </Button>
                      )}
                    </div>
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

