import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Product from "@/models/Product"

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as {
      id: string
      email: string
    }

    await dbConnect()
    return await User.findById(decoded.id)
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get full product details for each cart item
    const cartWithDetails = await Promise.all(
      (user.cart || []).map(async (item: any) => {
        const product = await Product.findOne({ product_id: item.productId })
        if (!product) return null
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          name: product.product_name,
          price: product.sale_price,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          category: product.category,
        }
      })
    )

    // Filter out null items (products that couldn't be found)
    const validCart = cartWithDetails.filter(item => item !== null)

    return NextResponse.json({
      success: true,
      cart: validCart,
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch cart",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { item } = await request.json()

    if (!item || !item.productId || !item.size) {
      return NextResponse.json({ error: "Invalid item data" }, { status: 400 })
    }

    // Check if product exists
    const product = await Product.findOne({ product_id: item.productId })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart
      ? user.cart.findIndex((cartItem: any) => 
          cartItem.productId === item.productId && cartItem.size === item.size)
      : -1

    if (existingItemIndex >= 0 && user.cart) {
      // Update quantity of existing item
      user.cart[existingItemIndex].quantity += item.quantity || 1
    } else {
      // Add new item to cart
      if (!user.cart) {
        user.cart = []
      }
      user.cart.push({
        productId: item.productId,
        quantity: item.quantity || 1,
        size: item.size,
      })
    }

    await user.save()

    // Get full product details for each cart item
    const cartWithDetails = await Promise.all(
      user.cart.map(async (item: any) => {
        const product = await Product.findOne({ product_id: item.productId })
        if (!product) return null
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          name: product.product_name,
          price: product.sale_price,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          category: product.category,
        }
      })
    )

    // Filter out null items
    const validCart = cartWithDetails.filter(item => item !== null)

    return NextResponse.json({
      success: true,
      cart: validCart,
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      {
        error: "Failed to add to cart",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update item quantity
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, size, quantity } = await request.json()

    if (!productId || !size || quantity === undefined) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Find the item in the cart
    const itemIndex = user.cart ? user.cart.findIndex((item: any) => 
      item.productId === productId && item.size === size) : -1

    if (itemIndex === -1 || !user.cart) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    // Update quantity or remove if quantity is 0
    if (quantity > 0) {
      user.cart[itemIndex].quantity = quantity
    } else {
      user.cart.splice(itemIndex, 1)
    }

    await user.save()

    // Get full product details for each cart item
    const cartWithDetails = await Promise.all(
      user.cart.map(async (item: any) => {
        const product = await Product.findOne({ product_id: item.productId })
        if (!product) return null
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          name: product.product_name,
          price: product.sale_price,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          category: product.category,
        }
      })
    )

    // Filter out null items
    const validCart = cartWithDetails.filter(item => item !== null)

    return NextResponse.json({
      success: true,
      cart: validCart,
    })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      {
        error: "Failed to update cart",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const productId = url.searchParams.get("productId")
    const size = url.searchParams.get("size")
    const clearAll = url.searchParams.get("clearAll") === "true"

    if (!clearAll && (!productId || !size)) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
    }

    if (!clearAll) {
      // Remove specific item
      const itemIndex = user.cart ? user.cart.findIndex((item: any) => 
        item.productId === productId && item.size === size) : -1

      if (itemIndex === -1 || !user.cart) {
        return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
      }

      user.cart.splice(itemIndex, 1)
    } else {
      // Clear entire cart
      user.cart = []
    }

    await user.save()

    // Get full product details for each cart item
    const cartWithDetails = await Promise.all(
      (user.cart || []).map(async (item: any) => {
        const product = await Product.findOne({ product_id: item.productId })
        if (!product) return null
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          name: product.product_name,
          price: product.sale_price,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          category: product.category,
        }
      })
    )

    // Filter out null items
    const validCart = cartWithDetails.filter(item => item !== null)

    return NextResponse.json({
      success: true,
      cart: validCart,
    })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json(
      {
        error: "Failed to update cart",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

