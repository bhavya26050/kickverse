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
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }
    
    // Verify token and get user ID
    let decoded
    try {
      decoded = verifyJwtToken(token)
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token", error: error instanceof Error ? error.message : String(error) },
        { status: 401 }
      )
    }
    
    // Find user and get wishlist
    const user = await User.findById(decoded.id)
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      userId: decoded.id,
      wishlist: user.wishlist || [],
      wishlistCount: (user.wishlist || []).length
    })
  } catch (error) {
    console.error("Wishlist debug error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Wishlist debug check failed" 
      },
      { status: 500 }
    )
  }
}