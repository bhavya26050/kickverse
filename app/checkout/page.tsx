"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/context/CartContext"
import { CreditCard, ArrowLeft, ShieldCheck, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"

// Define the Window interface with Razorpay
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const { items, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  
  // Calculate total price safely with a default of 0
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : 0
    return sum + (itemPrice * (item.quantity || 1))
  }, 0)
  
  // Calculate tax and total with tax
  const tax = totalPrice * 0.1
  const totalWithTax = totalPrice + tax
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  useEffect(() => {
    // Load cart from localStorage to ensure persistence
    const loadCart = () => {
      if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem("cartItems")
        console.log("Stored cart from localStorage:", storedCart)
        // If cart is being loaded as empty even though localStorage has items,
        // you could force a reload of the page
        if (items.length === 0 && storedCart && JSON.parse(storedCart).length > 0) {
          window.location.reload()
        }
      }
    }
    
    loadCart()
    
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    
    // Redirect if cart is empty after a short delay to ensure state is loaded
    const checkCartTimer = setTimeout(() => {
      if (items.length === 0 && sessionStatus !== "loading") {
        toast.error("Your cart is empty")
        router.push("/cart")
      }
    }, 500)
    
    // Set user info from session if available
    if (session?.user) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
      }))
    }
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      clearTimeout(checkCartTimer)
    }
  }, [items, router, session, sessionStatus])

  // Log cart items in real-time for debugging
  useEffect(() => {
    console.log("Current cart items:", items)
  }, [items])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error("Your cart is empty")
      router.push("/cart")
      return
    }

    try {
      setIsLoading(true)

      // Create order on server
      const response = await fetch("/api/payment/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customerInfo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment order")
      }

      // Initialize Razorpay
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "KickVerse",
        description: "Payment for your order",
        order_id: data.order.id,
        handler: (response: any) => {
          // Handle successful payment
          handlePaymentSuccess(response, data.order.id)
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#b026ff",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Error processing payment:", error)
      toast.error("Failed to process payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
      // Verify payment and update inventory
      const verifyResponse = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          items: items,
          shippingAddress: {
            name: customerInfo.name,
            address: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            zipCode: customerInfo.zipCode,
            country: customerInfo.country,
            phone: customerInfo.phone,
          },
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error("Payment verification failed")
      }

      // Set flag for successful order
      localStorage.setItem("orderCompleted", "true")

      // Clear cart and redirect
      clearCart()
      router.push("/success")
    } catch (error) {
      console.error("Error verifying payment:", error)
      toast.error("Payment was processed but verification failed. Please contact support.")
    }
  }

  // Show loading state while session is loading
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Button asChild variant="ghost" className="text-white/70 hover:text-white">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </div>
          
          <div className="glass-panel rounded-2xl p-8 max-w-md mx-auto mt-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-purple-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-white/70 mb-6">Add some amazing products to your cart and come back to checkout.</p>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-blue-500">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-white/70 hover:text-white">
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-gradient">Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handlePayment} className="glass-panel rounded-2xl p-6">
              <h2 className="text-xl font-medium mb-6">Shipping Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 border-white/20 focus-visible:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 border-white/20 focus-visible:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 border-white/20 focus-visible:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 border-white/20 focus-visible:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 border-white/20 focus-visible:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={customerInfo.state}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 border-white/20 focus-visible:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={customerInfo.zipCode}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 border-white/20 focus-visible:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={customerInfo.country}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 border-white/20 focus-visible:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <ShieldCheck className="text-teal-500" size={24} />
                <p className="text-white/70 text-sm">
                  Your personal data will be used to process your order, support your experience, and for other purposes
                  described in our privacy policy.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || items.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white py-6 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay with Razorpay (₹{Math.round(totalWithTax * 83)})
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <div className="glass-panel rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-medium mb-6">Order Summary</h2>

              <div className="max-h-80 overflow-y-auto mb-6 pr-2">
                {items.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color || ''}-${index}`}
                    className="flex gap-3 mb-4 pb-4 border-b border-white/10"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <div className="text-white/70 text-xs mt-1 space-y-1">
                        <p>Size: {item.size}</p>
                        <p>
                          Qty: {item.quantity} × ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-medium text-sm">
                      ${typeof item.price === 'number' ? (item.price * (item.quantity || 1)).toFixed(2) : '0.00'}
                    </div>
                  </div>
                ))}
              </div>

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
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalWithTax.toFixed(2)}</span>
                  </div>
                  <div className="text-white/70 text-xs text-right mt-1">
                    (Approx. ₹{Math.round(totalWithTax * 83)})
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="text-purple-500" size={20} />
                  <span className="font-medium">Payment Method</span>
                </div>
                <p className="text-white/70 text-sm">
                  Secure payment via Razorpay. We support credit/debit cards, UPI, net banking, and wallets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

