import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET() {
  try {
    await dbConnect()
    
    // Get all products
    const products = await Product.find({})
    
    // Calculate inventory statistics
    let totalProducts = products.length
    let inStockItems = 0
    let lowStockItems = 0
    let totalInventoryCount = 0
    
    // Inventory by category
    const inventoryByCategory: Record<string, number> = {}
    
    for (const product of products) {
      // Sum up inventory for the product
      let productTotalInventory = 0
      let hasLowStock = false
      
      for (const item of product.inventory || []) {
        productTotalInventory += item.quantity
        totalInventoryCount += item.quantity
        
        // Check if any variants have low stock (less than 5)
        if (item.quantity > 0 && item.quantity < 5) {
          hasLowStock = true
        }
      }
      
      // Count product as in stock if it has any inventory
      if (productTotalInventory > 0) {
        inStockItems++
      }
      
      // Count low stock items
      if (hasLowStock) {
        lowStockItems++
      }
      
      // Add to category totals
      const category = product.category || 'uncategorized'
      inventoryByCategory[category] = (inventoryByCategory[category] || 0) + productTotalInventory
    }
    
    return NextResponse.json({
      totalProducts,
      inStockItems,
      lowStockItems,
      totalInventoryCount,
      inventoryByCategory
    })
    
  } catch (error) {
    console.error("Error fetching inventory summary:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch inventory summary",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
