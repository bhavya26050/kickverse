import { NextRequest, NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const code = searchParams.get("code")
    
    if (!code) {
      console.error("Missing authorization code")
      return NextResponse.redirect(new URL("/login?error=Missing authorization code", request.url))
    }
    
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret"
    
    if (!googleClientId || !googleClientSecret) {
      console.error("Missing Google OAuth credentials")
      return NextResponse.redirect(new URL("/login?error=Configuration error", request.url))
    }
    
    // Initialize OAuth client
    const client = new OAuth2Client(googleClientId, googleClientSecret, redirectUri)
    
    // Exchange code for tokens
    console.log("Exchanging code for tokens...")
    const { tokens } = await client.getToken(code)
    client.setCredentials(tokens)
    
    if (!tokens.id_token) {
      console.error("No ID token received from Google")
      return NextResponse.redirect(new URL("/login?error=Authentication failed", request.url))
    }
    
    // Verify the ID token
    console.log("Verifying ID token...")
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: googleClientId,
    })
    
    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      console.error("Invalid Google token payload")
      return NextResponse.redirect(new URL("/login?error=Invalid token", request.url))
    }
    
    // Connect to database
    await dbConnect()
    
    // Check if user exists
    const { email, name, picture, sub } = payload
    console.log(`Processing Google user: ${email}`)
    
    let user = await User.findOne({ email }).lean()
    
    if (!user) {
      // Create new user
      console.log("Creating new user from Google account...")
      const newUser = new User({
        email,
        name: name || email.split('@')[0],
        provider: "google",
        providerId: sub,
        image: picture,
        role: "user",
        created_at: new Date(),
      })
      
      await newUser.save()
      user = newUser.toObject()
    } else if (user.provider !== "google") {
      // Update existing user with Google info
      console.log("Updating existing user with Google info...")
      user = await User.findOneAndUpdate(
        { email },
        {
          provider: "google",
          providerId: sub,
          image: picture,
        },
        { new: true, lean: true }
      )
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
      jwtSecret,
      { expiresIn: "7d" }
    )
    
    // Create response with redirect
    const response = NextResponse.redirect(new URL("/profile", request.url))
    
    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    })
    
    return response
    
  } catch (error) {
    console.error("Google authentication error:", error)
    const errorMessage = error instanceof Error ? 
      encodeURIComponent(error.message) : 
      "Failed to authenticate with Google"
    
    return NextResponse.redirect(
      new URL(`/login?error=${errorMessage}`, request.url)
    )
  }
}