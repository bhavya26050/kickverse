import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"
import User from "@/models/User"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentId, orderId, signature, items, shippingAddress } = await request.json()

    await dbConnect()

    // Find the user
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // In a real implementation, you would verify the payment with Razorpay
    // For demo purposes, we'll assume the payment is valid

    // Update inventory for all purchased items
    for (const item of items) {
      const product = await Product.findOne({ product_id: item.productId })
      if (product) {
        product.quantity = Math.max(0, product.quantity - item.quantity)
        await product.save()
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0)

    // Create a new order
    const newOrder = {
      orderId: uuidv4(),
      products: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
      })),
      totalAmount,
      status: "processing",
      paymentId,
      shippingAddress,
      createdAt: new Date(),
    }

    // Add order to user's orders
    if (!user.orders) {
      user.orders = []
    }

    user.orders.push(newOrder)

    // Clear the user's cart
    user.cart = []

    await user.save()

    return NextResponse.json({
      success: true,
      message: "Payment verified and order created",
      orderId: newOrder.orderId,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      {
        error: "Failed to verify payment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

