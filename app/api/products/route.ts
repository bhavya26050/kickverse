import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const query = searchParams.get("q")
    
    let filterOptions: any = {}
    
    if (category) {
      filterOptions.category = category.toLowerCase()
    }
    
    if (brand) {
      filterOptions.brand = brand
    }
    
    if (query) {
      filterOptions.product_name = { $regex: query, $options: "i" }
    }
    
    console.log("Filter options:", filterOptions)
    
    // Using lean() to get plain JavaScript objects instead of Mongoose documents
    const products = await Product.find(filterOptions).lean()
    
    console.log(`Found ${products.length} products`)
    
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { message: "Failed to fetch products", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

