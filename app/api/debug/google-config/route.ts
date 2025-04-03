import { NextResponse } from "next/server"

export async function GET() {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.REDIRECT_URI

    if (!googleClientId) {
      return NextResponse.json(
        { success: false, message: "GOOGLE_CLIENT_ID is missing" },
        { status: 400 }
      )
    }

    if (!googleClientSecret) {
      return NextResponse.json(
        { success: false, message: "GOOGLE_CLIENT_SECRET is missing" },
        { status: 400 }
      )
    }

    if (!redirectUri) {
      return NextResponse.json(
        { success: false, message: "REDIRECT_URI is missing" },
        { status: 400 }
      )
    }

    // Mask secrets for security
    const maskedClientId = googleClientId.substring(0, 5) + "..." + 
                           googleClientId.substring(googleClientId.length - 5)
    
    const maskedClientSecret = googleClientSecret.substring(0, 3) + "..." + 
                               googleClientSecret.substring(googleClientSecret.length - 3)
    
    return NextResponse.json({
      success: true,
      message: "Google OAuth configuration is present",
      clientId: maskedClientId,
      clientSecret: maskedClientSecret,
      redirectUri: redirectUri
    })
    
  } catch (error) {
    console.error("Google Auth debug error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Google Auth configuration check failed" 
      },
      { status: 500 }
    )
  }
}