import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    await dbConnect()

    // Find the product
    const product = await Product.findOne({ product_id: productId })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if enough stock is available
    if (product.quantity < quantity) {
      return NextResponse.json(
        {
          error: "Not enough stock available",
          availableStock: product.quantity,
        },
        { status: 400 },
      )
    }

    // Update stock
    product.quantity -= quantity
    await product.save()

    return NextResponse.json({
      success: true,
      message: "Inventory updated successfully",
      updatedStock: product.quantity,
    })
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json(
      {
        error: "Failed to update inventory",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

