import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Product from "@/models/Product"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { products, shippingAddress, totalAmount, paymentId } = body
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "Products are required" },
        { status: 400 }
      )
    }
    
    // First check if all products have sufficient inventory
    for (const item of products) {
      const product = await Product.findOne({ id: item.productId })
      
      if (!product) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Product not found: ${item.productId}` 
          },
          { status: 404 }
        )
      }
      
      const inventoryItem = product.inventory.find(
        (inv: any) => inv.size === item.size && inv.color === item.color
      )
      
      if (!inventoryItem || inventoryItem.quantity < item.quantity) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Insufficient inventory for ${product.name} in size ${item.size} and color ${item.color}` 
          },
          { status: 400 }
        )
      }
    }
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Create the order
    const order = {
      orderId,
      products,
      totalAmount,
      status: "processing",
      paymentId,
      shippingAddress,
      createdAt: new Date(),
    }
    
    // Update user with new order
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $push: { orders: order } },
      { new: true }
    )
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }
    
    // Update inventory for each product
    for (const item of products) {
      await Product.updateOne(
        { 
          id: item.productId,
          "inventory.size": item.size,
          "inventory.color": item.color
        },
        { 
          $inc: { "inventory.$.quantity": -item.quantity } 
        }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      orders: user.orders || []
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
