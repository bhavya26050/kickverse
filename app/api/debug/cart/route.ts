import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { verifyJwtToken } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Get token from cookies
    const token = request.cookies.get("token")?.value
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Not authenticated",
        cartItems: []
      })
    }
    
    // Verify token and get user ID
    let decoded
    try {
      decoded = verifyJwtToken(token)
    } catch (error) {
      return NextResponse.json({
        success: false, 
        message: "Invalid token", 
        error: error instanceof Error ? error.message : String(error),
        cartItems: []
      })
    }
    
    // Find user and get cart
    const user = await User.findById(decoded.id)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        cartItems: []
      })
    }
    
    return NextResponse.json({
      success: true,
      userId: decoded.id,
      cart: user.cart || [],
      cartItemCount: (user.cart || []).length
    })
  } catch (error) {
    console.error("Cart debug error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Cart debug check failed",
        cartItems: []
      },
      { status: 500 }
    )
  }
}