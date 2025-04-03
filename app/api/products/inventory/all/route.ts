import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET() {
  try {
    await dbConnect()
    
    // Get all products
    const products = await Product.find({})
    
    // Flatten products inventory into a list of items
    const inventoryItems = products.flatMap(product => {
      return (product.inventory || []).map(item => ({
        productId: product.id,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        category: product.category,
        size: item.size,
        color: item.color,
        quantity: item.quantity
      }))
    })
    
    return NextResponse.json({
      success: true,
      count: inventoryItems.length,
      inventory: inventoryItems
    })
    
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch inventory",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
