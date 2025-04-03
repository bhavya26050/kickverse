import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"
import type { CartItem } from "@/types/product"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, customerInfo } = await request.json()

    if (!items || !items.length || !customerInfo) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    await dbConnect()

    // Verify all products exist and have sufficient stock
    for (const item of items) {
      const product = await Product.findOne({ product_id: item.productId })

      if (!product) {
        return NextResponse.json(
          {
            error: `Product not found: ${item.productId}`,
          },
          { status: 404 },
        )
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Not enough stock for ${product.product_name}`,
            availableStock: product.quantity,
            productId: product.product_id,
          },
          { status: 400 },
        )
      }
    }

    // Calculate order amount
    const amount = items.reduce((total: number, item: CartItem) => {
      return total + (item.price || 0) * item.quantity
    }, 0)

    // In a real implementation, you would use the Razorpay SDK to create an order
    // For demo purposes, we're creating a mock order
    const order = {
      id: "order_" + Math.random().toString(36).substring(2, 15),
      amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(2, 10),
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      order: order,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_yourkeyhere", // This would be your actual Razorpay key in production
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      {
        error: "Failed to create payment order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

