import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as {
      id: string
      email: string
      name: string
      role: string
    }

    // Connect to database
    await dbConnect()

    // Find user
    const user = await User.findById(decoded.id)

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    // Return user data
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    })
  } catch (error) {
    console.error("Error in /me endpoint:", error)
    return NextResponse.json(
      { message: "Not authenticated" },
      { status: 401 }
    )
  }
}