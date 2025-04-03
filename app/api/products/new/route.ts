import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productData = await request.json()

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "price",
      "images",
      "category",
      "subcategory",
      "sizes",
      "colors",
      "stock",
    ]
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate ID if not provided
    if (!productData.id) {
      productData.id =
        productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") +
        "-" +
        Date.now().toString().slice(-4)
    }

    await dbConnect()

    // Check if product with same ID already exists
    const existingProduct = await Product.findOne({ id: productData.id })
    if (existingProduct) {
      return NextResponse.json({ error: "Product with this ID already exists" }, { status: 409 })
    }

    // Create new product
    const newProduct = await Product.create(productData)

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

